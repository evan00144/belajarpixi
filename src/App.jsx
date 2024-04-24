import "./App.css";

import { Application, Assets, Container, Graphics, Sprite, TextStyle } from "pixi.js";
import { Stage, Text } from "@pixi/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

	const rectangle = useCallback(
		(g, props) => {
			g.clear();
			g.beginFill(0xff700b, 1);
			g.drawRect(-50, 0, props.width, props.height);
			g.endFill();
		},
		[lm],
	);

	const spriteRef = useRef([]);
	const [trigger, setTrigger] = useState(false);

	useEffect(() => {
		let app = new Application();
		let dragTarget;

		const generateMaskAndLayout = () => {
			let mask = null;
			let container = null;
			let layout = null;
			let containerArray = [];

			lm.forEach((e, idx) => {
				// Generate Mask
				mask = new Graphics().rect(e.x, e.y, e.width, e.height);
				mask.fill("white");

				// Generate Container
				container = new Container();
				container.x = e.x;
				container.y = e.y;
				container.height = e.height;

				// Adding Mask to Container
				container.mask = mask;
				container.cursor = "pointer";
				container.eventMode = "static";

				// Generate Layout
				layout = new Graphics().rect(0, 0, 700, 700).fill(0xff700b);
				layout.cursor = "pointer";
				layout.eventMode = "static";

				layout.on("pointerdown", onDragStart,layout);

				container.addChild(layout);
				containerArray.push(container);
			});
			return containerArray;
		};

		const init = async () => {
			await app.init({ width: 1200, height: 1800 });

			const stage = app.stage;

			document.body.innerHTML = "";
			document.body.appendChild(app.canvas);

			const layoutMedia = generateMaskAndLayout();

			const loadFrame = await Assets.load("/img/frame2.png");
			const frame = new Sprite(loadFrame);


			stage.eventMode = "static";
			stage.hitArea = app.screen;
			stage.on('pointerup', onDragEnd);
			stage.on('pointerupoutside', onDragEnd);

			layoutMedia.forEach((masking, index) => {
				stage.addChild(masking);
			});

			stage.addChild(frame);
		};

		function onDragStart() {
			dragTarget = this;
			dragTarget.alpha = 0.5;
			app.stage.on("pointermove", onDragMove);
		}
		function onDragMove(event) {
			if (dragTarget) {
				const newX = event.global.x - dragTarget.width / 2;
				const newY = event.global.y - dragTarget.height / 2;
				const newGlobal = {
					x: newX,
					y: newY,
				};
				console.log(dragTarget);
				console.log(event);
				console.log(event.movement);
				console.log(event.global);
				// dragTarget.x = newX
				// dragTarget.y = newY
				dragTarget.parent.toLocal(newGlobal, null, dragTarget.position);
			}
		}
		function onDragEnd() {
			console.log('asd')
			if (dragTarget) {
				dragTarget.off("pointermove", onDragMove);
				dragTarget.alpha = 1;
				dragTarget = null;
			}
		}
		init();
	}, []);

	const renderLayoutAndPhotos = useMemo(() => {
		return;
		return (
			<>
				{lm.map((e, idx) => (
					<Container x={e.x} y={e.y} height={e.height} width={e.width} mask={spriteRef.current[idx]} key={idx}>
						<Graphics
							ref={(node) => {
								if (node) {
									spriteRef.current.push(node);
								}
								return spriteRef.current[idx];
							}}
							draw={(g) => rectangle(g, e)}
						/>
						<Sprite image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} />
					</Container>
				))}
			</>
		);
	}, [trigger]);

	return (
		<>
			{/* <Stage ref={stageRef} width={1200} height={1800} options={{ background: 0x1099bb }}> */}
			{/* {renderLayoutAndPhotos} */}
			{/* <Sprite image={"/img/frame2.png"} /> */}
			{/* </Stage> */}
			{/* <button
				onClick={() => {
					setTrigger(!trigger);
				}}>
				asd
			</button> */}
		</>
	);
}

export default App;
