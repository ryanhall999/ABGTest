import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const [prodList, setProdList] = useState([]);
	const [active, setActive] = useState([]);

	function randomProperty(obj) {
		// Function to randomly select 15 products
		var keys = Object.keys(obj);
		return obj[keys[(keys.length * Math.random()) << 0]];
	}

	function cardInfo(e) {
		// Sets clicked number on list as active
		const prod2 = prodList.find(({ niin }) => niin == e.target.id);
		setActive(prod2);
	}

	function setEmpty() {
		// Clears active product
		setActive([]);
	}

	const findProd = async (e) => {
		// Handles search for individual product
		e.preventDefault();
		let prodNum = {};
		prodNum.value = e.target[0].value.split("-")[2];
		await axios.post("/api/indvProduct", prodNum).then((response) => {
			if (response.data) {
				setActive(response.data);
			} else {
				alert("No Match");
			}
		});
	};

	useEffect(() => {
		// Loads list of products on refresh
		Promise.all([axios.get("/api/product_list")])
			.then((responses) => responses.map((response) => response.data))
			.then((results) => {
				let newArr = [];
				for (let i = 0; i < 15; i++) {
					newArr.push(randomProperty(results[0]));
				}
				setProdList(newArr);
			})
			.catch((ex) => console.log(ex.response.data.message));
	}, []);

	if (active.niin) {
		return (
			<div id="outer_box">
				<div id="head">
					<img
						src="https://aerobasegroup.com/public/images/logo.png"
						onClick={setEmpty}
					></img>
					<div id="inputs">
						<form onSubmit={(e) => findProd(e)}>
							<input
								type="text"
								name="prodName"
								placeholder="search for parts"
							/>
							<input type="submit" value="Submit" />
						</form>
					</div>
				</div>
				<div>
					<div id="individualItem">
						<ul>
							<li>
								{active.fsc}-{active.country_code}-{active.niin}
							</li>
							<li>Name: {active.name}</li>
							<li>Part Number: {active.part_number}</li>
							<li>Cage Code: {active.cage_code}</li>
							<li>Rncc: {active.rncc}</li>
							<li>Rnvc: {active.rnvc}</li>
							<li>Dac: {active.dac}</li>
							<li>Rnaac: {active.rnaac}</li>
							<li>Rncc: {active.status}</li>
							<li>Status: {active.cage_code}</li>
							<li>Msds: {active.msds}</li>
							<li>Sadc: {active.sadc}</li>
							<li>INC: {active.inc}</li>
							<li>Item Number:{active.item_number}</li>
							<li>Publication Date:{active.publication_date}</li>
						</ul>
					</div>
				</div>
			</div>
		);
	} else if (prodList[0]) {
		return (
			<div id="outer_box">
				<div id="head">
					<img
						src="https://aerobasegroup.com/public/images/logo.png"
						onClick={setEmpty}
					></img>
					<div id="inputs">
						<form onSubmit={(e) => findProd(e)}>
							<input
								type="text"
								name="prodName"
								placeholder="search for parts"
							/>
							<input type="submit" value="Submit" />
						</form>
					</div>
				</div>
				<div>
					<div id="items">
						<ul>
							<li id="listHead"> NSN and Part Name</li>
							{prodList.map((prod) => {
								return (
									<li id="prod" key={prod.niin}>
										<h1 onClick={cardInfo} id={prod.niin}>
											{prod.fsc}-{prod.country_code}-{prod.niin}
										</h1>
										<div className="prodInfo">
											<h3>Product Name: {prod.name}</h3>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div id="head">
					<img
						src="https://aerobasegroup.com/public/images/logo.png"
						onClick={setEmpty}
					></img>
					<div id="inputs">
						<form onSubmit={(e) => findProd(e)}>
							<input
								type="text"
								name="prodName"
								placeholder="search for parts"
							/>
							<input type="submit" value="Submit" />
						</form>
					</div>
				</div>
				<div id="items"></div>
			</div>
		);
	}
}

export default App;
