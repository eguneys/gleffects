### Usage

    yarn install
    yarn start

This will run `webpack-dev-server` and bundle your code, now visit: `localhost:3000` to see the result.

    
### Notes

Follow along by cloning this repo https://github.com/eguneys/gleffects.

Our main setup is this fragment shader;

`src/shaders/main.frag`

```glsl

    float sdf(vec2 p) {
      return 1.0;
    }

    vec3 shade(float sd) {

      vec3 col = vec3(smoothstep(0.0, 0.01, abs(sd)));

      return col;
    }

    vec2 screenToWorld(vec2 screen) {
      vec2 result = 2.0 * (screen/u_resolution.xy - 0.5);
      result.x *= u_resolution.x/u_resolution.y;
      return result;
    }

    void main() {

      vec2 p = screenToWorld(gl_FragCoord.xy);

      float sd = sdf(p);

      vec3 col = shade(sd);

      outColor = vec4(col, 1.0);
    }


```

`gl_FragCoord.xy` returns the pixels x,y coordinate in screen space `[screen width, screen height]`.

`screenToWorld` converts screen space to world space, in this case converts `[screen width, screen height]` to `[-1, 1]` range.

Now, we have a point `sd` in world space, we pass it to our signed distance function `sdf` and it's output to `shade` function to finally return a color. `sdf` returns a float in the `[-1,1]` range, and `shade` function returns a color, when combined for all pixels in the screen will make the shape visible.

`shade` function just takes a float `sd` and does an `abs(sd)` this will map `[-1, 1]` to `[1,1]` with 0 in the middle. For `[-1,1]` range, this would return white on the edges, and black in the middle because 0 is color black, and everything in between interpolated. Now we later use `smoothstep(0.0, 0.01, abs(sd))` which will only interpolate when the `abs(sd)` is in the range 0.0 and 0.01, and return between range `[0, 1]`. For example it will return outputs like these:

```
abs(sd)  0.0  0.005 0.01 0.02 0.9 1.0
output   0.0  0.5   1.0  1.0  1.0 1.0
```

This means everything will be white except when the `abs(sd)` is close to 0. So when `sdf` returns close to 0, this defines the outline of the shape. Try returning the above values from `sdf` and see the output colors. 

Now, our goal is to map point `p` (`vec2` in `[-1,1]` range), to a `float` in `[-1,1]` range, and if the point is an outline of the shape return 0 otherwise return non-zero.

Try `p.x`, this will return 0 when x is 0, so that's a vertical line passing thru origin. You can try `p.x + .8` that shifts the line by .8 ratio. Similarly `p.y` returns a horizontal line.


### References

[The Book Of Shaders](https://thebookofshaders.com/)

[Raymarching Workshop](https://github.com/ajweeks/RaymarchingWorkshop)


