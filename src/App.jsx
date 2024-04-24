import "./App.css";

import { Application, Assets, Container, Graphics, Sprite, TextStyle } from "pixi.js";
import { Stage, Text } from "@pixi/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

function App() {
	const strip3v2 = [
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

	const strip3v1 = [
		//LEFT SIDE
		{
			width: 525,
			height: 490,
			x: 37,
			y: 131,
			photo_index: 0,
			gravity: "center",
		},
		{
			width: 525,
			height: 490,
			x: 37,
			y: 628,
			photo_index: 1,
			gravity: "center",
		},
		{
			width: 525,
			height: 490,
			x: 38,
			y: 1125,
			photo_index: 2,
			gravity: "center",
		},
		//RIGHT SIDE
		{
			width: 525,
			height: 490,
			x: 638,
			y: 131,
			photo_index: 0,
			gravity: "center",
		},
		{
			width: 525,
			height: 490,
			x: 638,
			y: 628,
			photo_index: 1,
			gravity: "center",
		},
		{
			width: 525,
			height: 490,
			x: 638,
			y: 1125,
			photo_index: 2,
			gravity: "center",
		},
		//QRIS
		{
			width: 95,
			height: 95,
			x: 445,
			y: 1657,
			photo_index: -1,
			gravity: "center",
		},
		{
			width: 95,
			height: 95,
			x: 1045,
			y: 1657,
			photo_index: -1,
			gravity: "center",
		},
	];
	const lm = strip3v1;

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
				layout = new Graphics().rect(0, 0, e.width, e.height).fill(0x808080);
				layout.cursor = "pointer";
				layout.eventMode = "static";

				layout.on("pointerdown", onDragStart, layout);

				container.addChild(layout);
				containerArray.push(container);
			});
			return containerArray;
		};

		const init = async () => {
			await app.init({ width: 1200, height: 1800, background: "white" });

			const stage = app.stage;

			document.body.innerHTML = "";
			document.body.appendChild(app.canvas);

			const layoutMedia = generateMaskAndLayout();

			const loadFrame = await Assets.load("/img/strip3v1.png");
			const frame = new Sprite(loadFrame);
			frame.eventMode = "none";

			stage.eventMode = "static";
			stage.hitArea = app.screen;
			stage.on("pointerup", onDragEnd);
			stage.on("pointerupoutside", onDragEnd);

			layoutMedia.forEach((masking, index) => {
				stage.addChild(masking);
			});
			stage.addChild(frame);
		};

		let mousePressPoint = {};
		let dragging = true;

		function onDragStart(e) {
			let data = e.data;
			dragging = true;
			dragTarget = this;
			data.alpha = 0.5;

			console.log(data.getLocalPosition(this.parent).x)
			console.log(this.position.x)
			console.log(this.parent.x)

			mousePressPoint.x = data.getLocalPosition(this.parent).x - this.position.x;
			mousePressPoint.y = data.getLocalPosition(this.parent).y - this.position.y;

			console.log(dragTarget);

			app.stage.on("pointermove", onDragMove);
		}

		function onDragMove(event) {
			if (dragging) {
				let newX, newY;

				// ini selalu ketika klik item nya ketengah
				// newX = event.global.x - dragTarget.width / 2;
				// newY = event.global.y - dragTarget.height / 2;

				// ini geser ikutin mouse
				newX = event.global.x - mousePressPoint.x;
				newY = event.global.y - mousePressPoint.y;

				const newGlobal = {
					x: newX,
					y: newY,
				};

				dragTarget.parent.toLocal(newGlobal, null, dragTarget.position);
			}
		}
		function onDragEnd() {
			if (dragging && dragTarget) {
				dragTarget.alpha = 1;
				dragTarget = null;
				dragging = false;
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
