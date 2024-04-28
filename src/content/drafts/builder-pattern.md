
How to avoid calling `unwrap()` or returning a `Option` on the build pattern. Basically using an intermediate (generic) object and only implementing `finalize` when all the fields are defined.

Additionally don't let the user create a `View` by adding the Phantom data, is there a better way to do this? maybe use `()` directly, but then clippy complains

```Rust

pub struct ViewBuilder<C, P> {
    camera: C,
    projection: P,
}

impl<C, P> ViewBuilder<C, P> {
    pub fn camera<V: Into<Point3<f32>>, Y: Into<Rad<f32>>, Pt: Into<Rad<f32>>>(
        self,
        position: V,
        yaw: Y,
        pitch: Pt,
    ) -> ViewBuilder<Camera, P> {
        ViewBuilder {
            camera: Camera::new(position, yaw, pitch),
            projection: self.projection,
        }
    }

    pub fn projection<F: Into<Rad<f32>>>(
        self,
        width: u32,
        height: u32,
        fovy: F,
        znear: f32,
        zfar: f32,
    ) -> ViewBuilder<C, Projection> {
        ViewBuilder {
            projection: Projection::new(width, height, fovy, znear, zfar),
            camera: self.camera,
        }
    }
}

impl ViewBuilder<Camera, Projection> {
    pub fn finalize(self, device: &wgpu::Device) -> View {
        let uniform = ViewUniform::new(&self.camera, &self.projection);

        let buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("View Buffer"),
            contents: bytemuck::cast_slice(&[uniform]),
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
        });

        let bind_group_layout = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("View bind group layout"),
            entries: &[wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            }],
        });

        let bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("View bind group"),
            layout: &bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: buffer.as_entire_binding(),
            }],
        });

        View {
            camera: self.camera,
            projection: self.projection,
            buffer,
            bind_group_layout,
            bind_group,
            no_private: PhantomData,
        }
    }
}

pub struct View {
    pub camera: Camera,
    pub projection: Projection,
    pub buffer: wgpu::Buffer,
    pub bind_group_layout: wgpu::BindGroupLayout,
    pub bind_group: wgpu::BindGroup,
    no_private: PhantomData<()>,
}

impl View {
    pub fn build() -> ViewBuilder<Option<Camera>, Option<Projection>> {
        ViewBuilder {
            camera: None,
            projection: None,
        }
    }

    pub fn as_uniform(&self) -> ViewUniform {
        ViewUniform::new(&self.camera, &self.projection)
    }

    // let view_bind_group_layout =
    //     device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
    //         label: Some("View bind group layout"),
    //         entries: &[wgpu::BindGroupLayoutEntry {
    //             binding: 0,
    //             visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
    //             ty: wgpu::BindingType::Buffer {
    //                 ty: wgpu::BufferBindingType::Uniform,
    //                 has_dynamic_offset: false,
    //                 min_binding_size: None,
    //             },
    //             count: None,
    //         }],
    //     });

    // let view_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
    //     label: Some("View bind group"),
    //     layout: &view_bind_group_layout,
    //     entries: &[wgpu::BindGroupEntry {
    //         binding: 0,
    //         resource: view_buffer.as_entire_binding(),
    //     }],
    // });
}
```
