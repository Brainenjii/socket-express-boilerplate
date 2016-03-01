"use strict";

var EW = require( "ext-webix" );

EW.define( "Demo.view.Viewport", {
	alias: "mainViewport",
	view: "layout",
	rows: [{
		view: "button",
		label: "Send socket ping",
		itemId: "btnSocket"
	}, {
		view: "button",
		label: "Send ajax ping",
		itemId: "btnAjax"
	}, {
		view: "button",
		label: "Send socket error",
		itemId: "btnSocketErr"
	}, {
		view: "button",
		label: "Send ajax error",
		itemId: "btnAjaxErr"
	}, {
		view: "textarea",
		label: "response",
		itemId: "txtResponse"
	}]
} );
