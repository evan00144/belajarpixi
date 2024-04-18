import "./App.css";

import { TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text, Graphics } from "@pixi/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as PIXI from 'pixi.js';

function App() {
	const lm = [
		//LEFT SIDE
		{
			x: 25,
			y: 43,
			width: 565,
			height: 520,
			photo_index: 0,
			gravity: "center",
		},
		{
			x: 25,
			y: 575,
			width: 565,
			height: 520,
			photo_index: 1,
			gravity: "center",
		},
		{
			x: 25,
			y: 1106,
			width: 565,
			height: 520,
			photo_index: 2,
			gravity: "center",
		},
		//RIGHT SIDE
		{
			x: 613,
			y: 43,
			width: 565,
			height: 520,
			photo_index: 0,
			gravity: "center",
		},
		{
			x: 613,
			y: 575,
			width: 565,
			height: 520,
			photo_index: 1,
			gravity: "center",
		},
		{
			x: 613,
			y: 1106,
			width: 565,
			height: 520,
			photo_index: 2,
			gravity: "center",
		},
		//QRIS
		{
			x: 445,
			y: 1657,
			width: 95,
			height: 95,
			photo_index: -1,
			gravity: "center",
		},
		{
			x: 1045,
			y: 1657,
			width: 95,
			height: 95,
			photo_index: -1,
			gravity: "center",
		},
	];

	const rectangle = useCallback((g, props) => {
		g.clear();
		g.beginFill(0xff700b, 1);
		g.drawRect(props.x, props.y, props.width, props.height);
		g.endFill();
	}, [lm]);

	// const Rectangle = (() => {

	//   return <Graphics draw={rectangle} />
	// });
  const maskRef = useRef(null);

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.mask = new PIXI.Graphics()
        .beginFill(0xffffff) // White color for the mask
        .drawRect(0, 0, 200, 200) // Adjust dimensions as needed
        .endFill();
    }
  }, []);



	return (
		<Stage width={1200} height={1800} options={{ background: 0x1099bb }}>
			<Sprite image={"/img/frame2.png"} />
			<Container x={0} y={0}  ref={maskRef}>
				{lm.map((e, idx) => (
					<React.Fragment key={idx}>
						<Graphics isMask={true} draw={(g) => rectangle(g, e)}/>
            <Sprite  image={'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png'}/>
					</React.Fragment>
				))}
			</Container>
		</Stage>
	);
}

export default App;
