var common=common||{};
var main = main || {};
main.cym = main.cym || {};

(function (cym) {

	var _cy_debug = 1;
	var _combo_debug = 0;
	var cy;
	var current_url_node;
	var highlight_url;
	var cxtmenus;
	var config_data = {
		fit: true,
		node_scale: 1,
		default_layout: 0,
		edge_colors: {
			'query_idea': 'yellow',
			'nav_link': '#88d',
			'tab_link': '#88d',
			'new_tab': 'lightcoral',
			'refjump': '#88d',
			'jump3': '#88d',
			'jump2': '#88d',
			'jump1': '#88d',
			'session': 'black',
			'line_default': 'lightgray'
		},
	};

	var cy_elements0 = [{
		group: 'nodes',
		data: {
			id: 'nothing',
			parent: 'nparent',
			name: 'nothing'
		},
	}];

	var cy_elements1 = [
		{
		"classes": "",
		/////////
		"data": {
			"comment": null,
			"id": "140762",
			"key": "google:недержание+остаточная+моча+\"1..1000+мл\"",
			"name": "google:недержание+остаточная+моча+\"1..1000+мл\"",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		//        "classes" : "filtered",
		"data": {
			"id": "39914",
			"edge_type": "referer",
			"source": "140762",
			"target": "140762"
		},
		"group": "edges"
	},
		{
		//"classes" : "filtered", /////////
		"data": {
			"comment": null,
			"id": "143674",
			"key": "google:cytoscape.js+right+click+canvas",
			"name": "google:cytoscape.js+right+click+canvas",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		//"classes" : "filtered", /////////
		"data": {
			"comment": null,
			"id": "143684",
			"key": "google:chrome+extension+canvas+right+click",
			"name": "google:chrome+extension+canvas+right+click",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		"classes": "filtered",
		"data": {
			"id": "40536",
			"edge_type": "query_idea",
			"source": "143674",
			"target": "143684"
		},
		"group": "edges"
	},
		{
		//"classes" : "filtered", /////////
		"data": {
			"comment": null,
			"id": "143691",
			"key": "google:chrome+extension+right+click+canvas",
			"name": "google:chrome+extension+right+click+canvas",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		"classes": "filtered",
		"data": {
			"id": "40538",
			"edge_type": "query_idea",
			"source": "143674",
			"target": "143691"
		},
		"group": "edges"
	},
		{
		//"classes" : "filtered", /////////
		"data": {
			"comment": null,
			"id": "143702",
			"key": "google:cytoscape.js+canvas+contextmenu",
			"name": "google:cytoscape.js+canvas+contextmenu",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		"classes": "filtered",
		"data": {
			"id": "40543",
			"edge_type": "query_idea",
			"source": "143674",
			"target": "143702"
		},
		"group": "edges"
	},
		{
		"classes": "filtered",
		/////////
		"data": {
			"comment": null,
			"id": "143711",
			"key": "google:\"cytoscape.js\"+cxtmenu+coordinates",
			"name": "google:\"cytoscape.js\"+cxtmenu+coordinates",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		//				"classes" : "filtered", /////////
		"data": {
			"comment": null,
			"id": "143715",
			"key": "google:\"cytoscape.js\"+click+coordinates",
			"name": "google:\"cytoscape.js\"+click+coordinates",
			"node_type": "query",
			"rating": null
		},
		"group": "nodes"
	},
		{
		"classes": "filtered",
		"data": {
			"id": "40547",
			"edge_type": "query_idea",
			"source": "143711",
			"target": "143715"
		},
		"group": "edges"
	}
	];

	var styles = {
		base_style: [
			{
			'selector': 'node',
			'style': {
				//'width': '60px',
				'width': 'mapData(degree,0,5,20,80)'
				//, 'height': '60px',
				,
				'height': 'mapData(degree,0,5,20,80)',
				'content': 'data(id)'
			}
		},
			    {
			'selector': 'edge',
			'style': {
				'width': 5,
				'target-arrow-shape': 'triangle',
				'opacity': 1,
				//'target-arrow-color' : '#800',
				//'target-arrow-color': 'gray',
				//'source-arrow-color': 'gray',
				//'line-color': 'red',
				//'line_color' : config_data.edge_colors['line_default'],
			}
		},

			],

		graph_style: [

			{
			'selector': 'node.ids',
			'style': {
				'content': 'data(id)'
			}
		},
			{
			'selector': 'node.names',
			'style': {
				'content': 'data(name)'
			}
		},


			{
			'selector': 'node[degree >= 0][degree < 1]',
			'style': {
				'width': '20px'
			}
		},
			{
			'selector': 'node[degree>=1][degree<3]',
			'style': {
				'width': 'mapData(degree, 1,2, 25, 30'
			}
		},
			{
			'selector': 'node[degree>=3][degree<5]',
			'style': {
				'width': 'mapData(degree, 3,4, 35, 50'
			}
		},
			{
			'selector': 'node[degree>=5][degree<8]',
			'style': {
				'width': 'mapData(degree, 5,7, 60, 90'
			}
		},
			{
			'selector': 'node[degree>=8][degree>=8]',
			'style': {
				'width': 'mapData(degree, 8, 20, 100, 200'
			}
		},
			{
			'selector': 'node[node_type="topic"]',
			'style': {
				'shape': 'diamond',
				'background-color': 'blue'
			}
		},
			{
			'selector': 'node[node_type="query"]',
			'style': {
				'shape': 'star'
			}
		},
			{
			'selector': 'node[node_type="url"]',
			'style': {
				'shape': 'rectangle'
			}
		},

		{
			'selector': 'node[?comment]',
			'style': {
				//'background-color': function (e) {
				//	return e.scratch('hsl')
				//}
				'shape': 'ellipse'
				//'background-color':'red'
			}
		},

		{
			'selector': 'node[rating < 0]',
			'style': {
				//'background-color': function (e) {
				//	return e.scratch('hsl')
				//}
				'background-color':'red'
			}
		},
		{ 'selector': 'node[rating > 0]', 'style': { 'background-color':'#6a6' } },
		{ 'selector': 'node[rating >= 2]', 'style': { 'background-color':'#6c6' } },
		{ 'selector': 'node[rating >= 5]', 'style': { 'background-color':'#6e6' } },
		{ 'selector': 'node[rating >= 10]', 'style': { 'background-color':'#6f6' } },

		{ 'selector': 'node[priority > 0]', 'style': { 'background-color':'#9a0' } },
		{ 'selector': 'node[priority >= 2]', 'style': { 'background-color':'#cc0' } },
		{ 'selector': 'node[priority >= 5]', 'style': { 'background-color':'#ee0' } },
		{ 'selector': 'node[priority >= 10]', 'style': { 'background-color':'#ff0' } },
		{
			'selector': 'node[rating = 0]',
			'style': {
				//'background-color': function (e) {
				//	return e.scratch('hsl')
				//}
				'background-color':'violet'
			}
		},

			{
			'selector': 'node[degree=0]',
			'style': {
				'width': 10 * config_data.node_scale
			}
		},
		//{
		//	'selector': 'node[degree >= 0][degree < 20]',
		//	'style': {
		//		//'background-color': function (e) {
		//		//	return e.scratch('hsl')
		//		//}
		//		'background-color':'red'
		//	}
		//},


			],

		class_style: [


			    {
			'selector': 'node.filtered',
			'style': {
				'border-width': 5,
				'border-color': 'black',
			}
		},
			    {
			'selector': 'edge.filtered',
			'style': {
				'width': 10,
				'line-color': 'black',
				'target-arrow-color': 'black',
				'source-arrow-color': 'black',
			}
		},

			],

		gui_style: [
			{
			'selector': 'node:selected',
			'style': {
				'border-width': 5,
				'background-color': 'black',
				//'border-color': 'red',
				'opacity': 1
			}
		},
			{
			'selector': 'node.current_url',
			'style': {
				'border-width': 10,
				'border-style' : 'solid',
				'border-color': 'blue',
				//'border-color': 'red',
				'width' : 100,
				'height' : 100,
				'opacity': 1
			}
		},
			    {
			'selector': 'edge:selected',
			'style': {
				'line-color': 'red',
				'target-arrow-color': 'red',
				'source-arrow-color': 'red',
				'opacity': 1
			}
		},
			],

	};


  styles['edge_style'] = (function () {
		var style = [];
		for (var i in config_data['edge_colors']) {
			style.push({
				'selector': 'edge[edge_type = "' + i + '"]',
				'style': {
					'line-color': config_data['edge_colors'][i]
				}
			});
		}
		return style;
	})();


	var cy_config = {
		zoom: 1,
		maxZoom: 3,
		//elements: cy_elements1,
		layout: {
			name: 'preset'
		}
	};

	var cy_config1 = {
		zoom: 1,
		maxZoom: 3,
		elements: cy_elements1,
		layout: {
			name: 'preset'
		},
	};

	var cy_config2 = {
		zoom: 1,
		maxZoom: 3,
		//elements : cy_elements1,
		layout: {
			name: 'preset'
		},
	};



	var cydata2 = {
		zoom: 1,
		maxZoom: 3,

		container: document.getElementById('cy'),
		layout: {
			name: 'breadthfirst'
		},

		// so we can see the ids
		style: [
			{
			selector: 'node.ids',
			style: {
				'content': 'data(id)',
				'width': 'mapData(degree,0,5,20,80)',
				'height': 'mapData(degree,0,5,20,80)'
			}
		}, {
			selector: 'node.names',
			style: {
				'content': 'data(name)',
				'width': 'mapData(degree,0,5,20,80)',
				'height': 'mapData(degree,0,5,20,80)'
			}
		}
		],

		elements: [
			{
			"data": {
				"id": "7500",
				"name": "google:using+dreamweaver+generated+code+",
				"degree": 2
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "11342",
				"name": "url:http://stackoverflow.com/questions/13159846/dreamweaver-cs5-5-and-php-generated-code"
			},
			"group": "nodes",
			"degree": 12
		},
			{
			"data": {
				"id": 48,
				"source": "7500",
				"target": "11342"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "55511",
				"name": "google:найти+трекеры+по+magnet+ссылке"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "55555",
				"name": "url:http://habrahabr.ru/post/124496/",
				"degree": 1
			},
			"group": "nodes"

		},
			{
			"data": {
				"id": 10344,
				"source": "55511",
				"target": "55555"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "55897",
				"name": "google:торрент+DHT+NAT",
				"degree": 3
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "55920",
				"name": "url:http://rutracker.org/forum/viewtopic.php?t=207724",
				"degree": 7
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10491,
				"source": "55897",
				"target": "55920"

			},
			"group": "edges"
		},
			{
			"data": {
				"id": "56074",
				"name": "google:DHT+не+работает+NAT",
				"degree": 24
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "56469",
				"name": "url:http://lunapark.goodnet.su/groups/goodnet/forum/topic/16/",
				"degree": 6
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10705,
				"source": "56074",
				"target": "56469"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "56552",
				"name": "google:как+работает+поиск+в+DHT",
				"degree": 8
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10746,
				"source": "56552",
				"target": "55555",
				"degree": 3
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "56727",
				"name": "google:как+пиры+находят+друг+друга+в+DHT"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "56769",
				"name": "url:https://ru.wikibooks.org/wiki/BitTorrent/DHT"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10828,
				"source": "56727",
				"target": "56769"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "56823",
				"name": "google:как+настроить+DHT"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10850,
				"source": "56823",
				"target": "55555"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "56996",
				"name": "google:обновить+список+участников+DHT"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "57049",
				"name": "url:http://flylinkdc.com/dokuwiki/doku.php?id=ru:autoupdate"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10949,
				"source": "56996",
				"target": "57049"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "57054",
				"name": "google:обновить+список+нодов+DHT"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "57153",
				"name": "url:http://forum.zlofenix.org/t4076"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 10998,
				"source": "57054",
				"target": "57153"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "57270",
				"name": "url:http://forum.ubuntu.ru/index.php?topic=264260.0"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 11051,
				"source": "57054",
				"target": "57270"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "60273",
				"name": "google:мтс+остатки+трафика+smart+mini"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": "60306",
				"name": "url:http://mts-faq.ru/voprosy-i-otvety/kak-uznat-ostatok-trafika-na-tarife-mts-smart.html"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 12231,
				"source": "60273",
				"target": "60306"
			},
			"group": "edges"
		},
			{
			"data": {
				"id": "60484",
				"name": "url:http://tarifkin.ru/mts/kak-posmotret-ostatok-trafika-na-mts"
			},
			"group": "nodes"
		},
			{
			"data": {
				"id": 12308,
				"source": "60273",
				"target": "60484"
			},
			"group": "edges"
		}
		]
	};

	var cydata3 = {
		zoom: 1,
		maxZoom: 5,

		container: document.getElementById('cy'),
		layout: {
			name: 'breadthfirst'
		},

		// so we can see the ids
		style: [
			{
			selector: 'node.ids',
			style: {
				'content': 'data(id)',
				'width': 'mapData(degree,0,5,20,80)',
				'height': 'mapData(degree,0,5,20,80)'
			}
		}, {
			selector: 'node.names',
			style: {
				'content': 'data(name)',
				'width': 'mapData(degree,0,5,20,80)',
				'height': 'mapData(degree,0,5,20,80)'
			}
		}
		],
		elements: cy_elements1,
	};
	var cydata1 = {

		container: document.getElementById('cy'),

		style: [{
			selector: 'node.ids',
			style: {
				'content': 'data(id)'
			}
		}, {
			selector: 'node.names',
			style: {
				'content': 'data(nothing)'
			}
		}],


		elements: [{
			group: 'nodes',
			data: {
				id: 'n1',
				name: 'test',
				parent: 'nparent'
			},

			scratch: {
				foo: 'bar'
			},

			position: {
				x: 100,
				y: 100
			},

			selected: false,
			selectable: true,
			locked: false,
			grabbable: true,
			classes: 'foo bar'
		}, {
			data: {
				id: 'n2',
				name: 'test2',
			},
			renderedPosition: {
				x: 200,
				y: 200
			}
			// can alternatively specify position in rendered on-screen pixels
		}, { // node n3
			data: {
				id: 'n3',
				name: 'test3',
				parent: 'nparent'
			},
			position: {
				x: 123,
				y: 234
			}
		}, {
			data: {
				id: 'nparent',
				position: {
					x: 200,
					y: 100
				}
			}
		}, {
			data: {
				id: 'e1',
				source: 'n1',
				target: 'n3'
			}
		}, {
			"data": {
				"id": "605755",
				parent: 'nparent',
				"idInt": 605755,
				"name": "PCNA",
				"score": 0.006769776522008331,
				"query": true,
				"gene": true
			},
			"position": {
				"x": 481.0169597039117,
				"y": 384.8210888234145
			},
			"group": "nodes",
			"removed": false,
			"selected": false,
			"selectable": true,
			"locked": false,
			"grabbed": false,
			"grabbable": true
		}],

		layout: {
			name: 'preset'
		},

	};


	var current_layout;



	var lay_options = [
		{
		name: 'cose',

		// Called on `layoutready`
		ready: function () {},

		// Called on `layoutstop`
		stop: function () {},

		// Whether to animate while running the layout
		animate: true,

		// The layout animates only after this many milliseconds
		// (prevents flashing on fast runs)
		animationThreshold: 250,

		// Number of iterations between consecutive screen positions update
		// (0 -> only updated on the end)
		refresh: 20,

		// Whether to fit the network view after when done
		fit: config_data.fit,

		// Padding on fit
		padding: 30,

		// Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
		boundingBox: undefined,

		// Extra spacing between components in non-compound graphs
		componentSpacing: 100,

		// Node repulsion (non overlapping) multiplier
		nodeRepulsion: function (node) {
			return 400000;
		},

		// Node repulsion (overlapping) multiplier
		nodeOverlap: 10,

		// Ideal edge (non nested) length
		idealEdgeLength: function (edge) {
			return 10;
		},

		// Divisor to compute edge forces
		edgeElasticity: function (edge) {
			return 100;
		},

		// Nesting factor (multiplier) to compute ideal edge length for nested edges
		nestingFactor: 5,

		// Gravity force (constant)
		gravity: 80,

		// Maximum number of iterations to perform
		numIter: 1000,

		// Initial temperature (maximum node displacement)
		initialTemp: 200,

		// Cooling factor (how the temperature is reduced between consecutive iterations
		coolingFactor: 0.95,

		// Lower temperature threshold (below this point the layout will end)
		minTemp: 1.0,

		// Whether to use threading to speed up the layout
		useMultitasking: true
	},

		{
			name: 'spread',
			animate: false, // whether to show the layout as it's running
			ready: undefined, // Callback on layoutready
			stop: undefined, // Callback on layoutstop
			fit: true, // Reset viewport to fit default simulationBounds
			minDist: 20, // Minimum distance between nodes
			padding: 20, // Padding
			expandingFactor: -1.0, // If the network does not satisfy the minDist
			// criterium then it expands the network of this amount
			// If it is set to -1.0 the amount of expansion is automatically
			// calculated based on the minDist, the aspect ratio and the
			// number of nodes
			maxFruchtermanReingoldIterations: 50, // Maximum number of initial force-directed iterations
			maxExpandIterations: 4, // Maximum number of expanding iterations
			boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
			randomize: false // uses random initial node positions on true
		},
		{
		name: 'concentric',

		fit: config_data.fit,
		// whether to fit the viewport to the graph
		padding: 30,
		// the padding on fit
		startAngle: 3 / 2 * Math.PI,
		// where nodes start in radians
		sweep: undefined,
		// how many radians should be between the first and last node (defaults to full circle)
		clockwise: true,
		// whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
		equidistant: false,
		// whether levels have an equal radial distance betwen them, may cause bounding box overflow
		minNodeSpacing: 10,
		// min spacing between outside of nodes (used for radius adjustment)
		boundingBox: undefined,
		// constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
		avoidOverlap: true,
		// prevents node overlap, may overflow boundingBox if not enough space
		height: undefined,
		// height of layout area (overrides container height)
		width: undefined,
		// width of layout area (overrides container width)
		concentric: function (node) { // returns numeric value for each node, placing higher nodes in levels towards the centre
			return node.degree();
		},
		levelWidth: function (nodes) { // the variation of concentric values in each level
			return nodes.maxDegree() / 4
		},
		animate: false,
		// whether to transition the node positions
		animationDuration: 500,
		// duration of animation in ms if enabled
		animationEasing: undefined,
		// easing of animation if enabled
		ready: undefined,
		// callback on layoutready
		stop: undefined // callback on layoutstop
	}, {
		name: 'breadthfirst',

		fit: config_data.fit,
		// whether to fit the viewport to the graph
		directed: false,
		// whether the tree is directed downwards (or edges can point in any direction if false)
		padding: 30,
		// padding on fit
		circle: false,
		// put depths in concentric circles if true, put depths top down if false
		spacingFactor: 1.75,
		// positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
		boundingBox: undefined,
		// constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
		avoidOverlap: true,
		// prevents node overlap, may overflow boundingBox if not enough space
		roots: undefined,
		// the roots of the trees
		maximalAdjustments: 0,
		// how many times to try to position the nodes in a maximal way (i.e. no backtracking)
		animate: false,
		// whether to transition the node positions
		animationDuration: 500,
		// duration of animation in ms if enabled
		animationEasing: undefined,
		// easing of animation if enabled
		ready: undefined,
		// callback on layoutready
		stop: undefined // callback on layoutstop
	},  {
		name: 'circle',

		fit: config_data.fit,
		// whether to fit the viewport to the graph
		padding: 30,
		// the padding on fit
		boundingBox: undefined,
		// constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
		avoidOverlap: true,
		// prevents node overlap, may overflow boundingBox and radius if not enough space
		radius: undefined,
		// the radius of the circle
		startAngle: 3 / 2 * Math.PI,
		// where nodes start in radians
		sweep: undefined,
		// how many radians should be between the first and last node (defaults to full circle)
		clockwise: true,
		// whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
		sort: undefined,
		// a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
		animate: false,
		// whether to transition the node positions
		animationDuration: 500,
		// duration of animation in ms if enabled
		animationEasing: undefined,
		// easing of animation if enabled
		ready: undefined,
		// callback on layoutready
		stop: undefined // callback on layoutstop
	}, {
		name: 'grid',

		fit: config_data.fit,
		// whether to fit the viewport to the graph
		padding: 30,
		// padding used on fit
		boundingBox: undefined,
		// constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
		avoidOverlap: true,
		// prevents node overlap, may overflow boundingBox if not enough space
		avoidOverlapPadding: 10,
		// extra spacing around nodes when avoidOverlap: true
		condense: false,
		// uses all available space on false, uses minimal space on true
		rows: undefined,
		// force num of rows in the grid
		cols: undefined,
		// force num of columns in the grid
		position: function (node) {},
		// returns { row, col } for element
		sort: undefined,
		// a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
		animate: false,
		// whether to transition the node positions
		animationDuration: 500,
		// duration of animation in ms if enabled
		animationEasing: undefined,
		// easing of animation if enabled
		ready: undefined,
		// callback on layoutready
		stop: undefined // callback on layoutstop
	}
	    ,  {
        name: 'cola',
        animate: true, // whether to show the layout as it's running
        refresh: 1, // number of ticks per frame; higher is faster but more jerky
        maxSimulationTime: 4000, // max length in ms to run the layout
        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
        fit: true, // on every layout reposition of nodes, fit the viewport
        padding: 30, // padding around the simulation
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        // layout event callbacks
        ready: function () {
        }, // on layoutready
        stop: function () {
        }, // on layoutstop

        // positioning options
        randomize: true, // use random node positions at beginning of layout
        avoidOverlap: true, // if true, prevents overlap of node bounding boxes
        handleDisconnected: true, // if true, avoids disconnected components from overlapping
        nodeSpacing: function (node) {
            return 10;
        }, // extra spacing around nodes
        flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
        alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

        // different methods of specifying edge length
        // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
        edgeLength: undefined, // sets edge length directly in simulation
        edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
        edgeJaccardLength: undefined, // jaccard edge length in simulation

        // iterations of cola algorithm; uses default values on undefined
        unconstrIter: undefined, // unconstrained initial layout iterations
        userConstIter: undefined, // initial layout iterations with user-specified constraints
        allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

        // infinite layout options
        infinite: false // overrides all other options for a forces-all-the-time mode
    },
		{
        name: 'arbor',
        animate: true, // whether to show the layout as it's running
        maxSimulationTime: 4000, // max length in ms to run the layout
        fit: true, // on every layout reposition of nodes, fit the viewport
        padding: 30, // padding around the simulation
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout

        // callbacks on layout events
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop

        // forces used by arbor (use arbor default on undefined)
        repulsion: undefined,
        stiffness: undefined,
        friction: undefined,
        gravity: true,
        fps: undefined,
        precision: undefined,
        // static numbers or functions that dynamically return what these
        // values should be for each element
        // e.g. nodeMass: function(n){ return n.data('weight') }
        nodeMass: undefined,
        edgeLength: undefined,
        stepSize: 0.1, // smoothing of arbor bounding box

        // function that returns true if the system is stable to indicate
        // that the layout can be stopped
        stableEnergy: function (energy) {
            var e = energy;
            return (e.max <= 0.5) || (e.mean <= 0.3);
        },
        // infinite layout options
        infinite: false // overrides all other options for a forces-all-the-time mode
    }
//		,  {
//        name: 'springy',
//        animate: false, // whether to show the layout as it's running
//        maxSimulationTime: 4000, // max length in ms to run the layout
//        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
//        fit: true, // whether to fit the viewport to the graph
//        padding: 30, // padding on fit
//        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//        random: false, // whether to use random initial positions
//        infinite: true, // overrides all other options for a forces-all-the-time mode
//        ready: undefined, // callback on layoutready
//        stop: undefined, // callback on layoutstop
//
//        // springy forces
//        stiffness: 400,
//        repulsion: 400,
//        damping: 0.5
//    }
		, 		{
			       name: 'springy',
				animate: true, // whether to show the layout as it's running
				maxSimulationTime: 4000, // max length in ms to run the layout
				ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
				fit: true, // whether to fit the viewport to the graph
				padding: 30, // padding on fit
				boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
				randomize: false, // whether to use random initial positions
				infinite: false, // overrides all other options for a forces-all-the-time mode
				ready: undefined, // callback on layoutready
				stop: undefined, // callback on layoutstop

				// springy forces and config
				stiffness: 400,
				repulsion: 400,
				damping: 0.5,
				edgeLength: function( edge ){
					var length = edge.data('length');

					if( length !== undefined && !isNaN(length) ){
						return length;
					}
				}
			}
			,
			{
				name: 'cose-bilkent',
				// Called on `layoutready`
				ready: function () {
				},
				// Called on `layoutstop`
				stop: function () {
				},
				// Whether to fit the network view after when done
				fit: true,
				// Padding on fit
				padding: 10,
				// Whether to enable incremental mode
				randomize: true,
				// Node repulsion (non overlapping) multiplier
				nodeRepulsion: 4500,
				// Ideal edge (non nested) length
				idealEdgeLength: 50,
				// Divisor to compute edge forces
				edgeElasticity: 0.45,
				// Nesting factor (multiplier) to compute ideal edge length for nested edges
				nestingFactor: 0.1,
				// Gravity force (constant)
				gravity: 0.4,
				// Maximum number of iterations to perform
				numIter: 2500,
				// For enabling tiling
				tile: true,
				//whether to make animation while performing the layout
				animate: false,
				//represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
				tilingPaddingVertical: 10,
				//represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
				tilingPaddingHorizontal: 10
			}
			,
			{ name: 'dagre',
				// dagre algo options, uses default value on undefined
				nodeSep: undefined, // the separation between adjacent nodes in the same rank
				edgeSep: undefined, // the separation between adjacent edges in the same rank
				rankSep: undefined, // the separation between adjacent nodes in the same rank
				rankDir: 'LR', // 'TB' for top to bottom flow, 'LR' for left to right
				minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
				edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

				// general layout options
				fit: true, // whether to fit to viewport
				padding: 30, // fit padding
				animate: false, // whether to transition the node positions
				animationDuration: 500, // duration of animation in ms if enabled
				animationEasing: undefined, // easing of animation if enabled
				boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
				ready: function(){}, // on layoutready
				stop: function(){} // on layoutstop
			}
	];

	var add_style = function (style, selectors) {
		style = style || cy.style();
		for (var i = 0; i < selectors.length; i++) {
			var sel = selectors[i];
			style.selector(sel.selector).css(sel.style);
		}
	}

	var connect_to_new_node = function (eles, meta) {
		var newid = "newnode_" + cy.nodes().size();

		cy.batch(function () {
			var new_node = cy.add({
				group: "nodes",
				data: {
					id: newid,
					name: newid,
					node_type: meta.node_type
				},
				renderedPosition: meta.renderedPosition,
			});
			for (var i = 0; i < eles.length; i++) {
				newid = "newedge_" + cy.edges().size();
				var new_edge = cy.add({
					group: 'edges',
					data: {
						id: newid,
						source: new_node.id(),
						target: eles[i].id(),
						edge_type: 'related',
					}
				});
			}
			cy_add_metadata(new_node);
		});
	};

	var connect_selected_to_node = function (ele) {
		console.log("connect_selected_to_node");
		var selected = cy.$('node:selected');
		if (ele && ele.data() && ele.data().id != undefined) {
			cy.batch(function () {
				for (var i = 0; i < selected.length; i++) {
					newid = "newedge_" + cy.edges().size();
					var new_edge = cy.add({
						data: {
							id: newid,
							target: ele.id(),
							source: selected[i].id(),
							edge_type: 'related',
						}
					});
				}
			});
		}
	}

	var switch_to_node_url = function (ele) {
		var url = ele.data().url;
		console.log("go to node: "+url);
		if (url==null || url == "" ) {
			return;
		}
		main.switch_to_url (url);
	}

	var rainbow = function (n) {

		n = n * 240 / 255;
		return 'hsl(' + n + ',100%,50%)';
	}

	var load_node = function (ele) {
		load_node_info_by_key(ele.data().node_type, ele.data().key);
	}

	var qtip_ensure = function () {
		return;
		$('input').each(function () {
			$(this).qtip({

				show: {
					solo: true,
					delay: 10,
					event: 'mousedown',
					ready: false,
					effect: false
				},
				content: {
					text: function (event, api) {
						return api.elements.target.attr('value');
					}
				},
				adjust: {
					cyViewport: true,
					method: 'flip none'
				},
				position: {
					viewport: $(window)
					//				viewport: $('cy')
				},
				style: 'qtip-wiki',
				events: {
					show: function (event, api) {
						console.log('happened:', event);
						if (event.originalEvent.button !== 2) {
							// IE might throw an error calling preventDefault(), so use a try/catch block.
							try {
								event.preventDefault();
							}
							catch (e) {}
						}
					}
				}
			}).bind('contextmenu', function () {
				return false;
			});
		});
	}

	var add_style1 = function (style) {
		style = style || cytoscape.stylesheet();
		return style.selector('node').css({
			//'width': '60px',
			'width': 'mapData(degree,0,5,20,80)'
			//, 'height': '60px',
			,
			'height': 'mapData(degree,0,5,20,80)',
			'content': 'data(id)'
		}).selector('edge').css({
			'width': 5,
			'target-arrow-shape': 'triangle',
			'opacity': 1,
			//'target-arrow-color' : '#800',
			//'target-arrow-color': 'gray',
			//'source-arrow-color': 'gray',
			//'line-color': 'red',
			//'line_color' : config_data.edge_colors['line_default'],
		})
		//
		//    .selector('node.notable').css({
		//				'border-width': 5,
		//				'border-color': 'black',
		//		})
		//		.selector('node.filtered').css({
		//				'border-width': 5,
		//				'border-color': 'black',
		//		})
		//		.selector('edge.filtered').css({
		//				'width' : 10,
		//        'line-color': 'black',
		//				'target-arrow-color': 'black',
		//        'source-arrow-color': 'black',
		//		})
		//		.selector('node:selected')
		//      .css({
		//        'border-width': 5,
		//        'border-color': 'red',
		//        'opacity': 1
		//      })
		//		.selector('edge:selected')
		//      .css({
		//        'line-color': 'red',
		//        'target-arrow-color': 'red',
		//        'source-arrow-color': 'red',
		//        'opacity': 1
		//      })
		//
/*
		.selector('node.ids').css({'content': 'data(id)'})
		.selector('node.names').css({'content': 'data(name)'})
		.selector('node[degree >= 0][degree < 20]').css({'background-color': function(e) { return e.scratch('hsl') } })
		.selector('node[degree >= 0][degree < 20]').css({'background-color': function(e) { return e.scratch('hsl') } })
		.selector('node[degree >= 0][degree < 1]').css({'width': '20px'})
		.selector('node[degree>=1][degree<3]').css({'width': 'mapData(degree, 1,2, 25, 30'})
		.selector('node[degree>=3][degree<5]').css({'width': 'mapData(degree, 3,4, 35, 50'})
		.selector('node[degree>=5][degree<8]').css({'width': 'mapData(degree, 5,7, 60, 90'})
		.selector('node[degree>=8][degree>=8]').css({'width': 'mapData(degree, 8, 20, 100, 200'})
		.selector('node[node_type="topic"]').css({'shape': 'diamond', 'background-color': 'blue'})
		.selector('node[node_type="query"]').css({'shape': 'star'})
		.selector('node[node_type="url"]').css({'shape': 'roundrectangle'})
		.selector('node[degree=0]')
			.css({
				'width': 10*config_data.node_scale})
//*/

/*
		.selector('edge[edge_type = "session"]')
      .css({
				'line-color': 'black',
			})
		.selector('edge[edge_type = "jump1"]')
      .css({
				'line-color': '#88d',
			})
		.selector('edge[edge_type = "jump2"],')
      .css({
				'line-color': '#88d',
			})
		.selector('edge[edge_type = "jump3"]')
      .css({
				'line-color': '#88d',
			})
		.selector('edge[edge_type = "refjump"]')
      .css({
				'line-color': '#88d',
			})
		.selector('edge[edge_type = "tab_link"]')
      .css({
				'line-color': '#88d',
			})
		.selector('edge[edge_type = "nav_link"]')
      .css({
				'line-color': '#88d',
			})
		.selector('edge[edge_type = "query_idea"]')
      .css({
				'line-color': 'yellow',
			})

		//*/



/*
		 ,

						 {
	    selector : 'node[[degree==0]]',
	    style : {
		    'width' : 10*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=1][degree<2]]',
	    style : {
		    'width' : 15*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=2][degree<3]]',
	    style : {
		    'width' : 20*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=3][degree<5]]',
	    style : {
		    'width' : 25*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=5][degree<8]]',
	    style : {
		    'width' : 30*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=8][degree<13]]',
	    style : {
		    'width' : 35*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=13][degree<21]]',
	    style : {
		    'width' : 40*config_data.node_scale
	    }
	  } , {
	    selector : 'node[[degree>=21][degree<34]]',
	    style : {
		    'width' : 45*config_data.node_scale
	    }
	  }

	  */
	}




	cym.cy_change_element_data = function (id, data) {
		var element = cy.getElementById(id);
		if (!element) {
			console.log('element not found by id: ' + id);
			return;
		}
		if (!data) {
			console.log('no data for element id: ' + id);
			return;
		}
		for (var key in data) {
			element.data(key, data[key]);
		}
	}

	cym.get_new_elements = function () {
		var elements = cy.elements();
		var new_elements = {};
		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			var d = el.data();
			if (new_elements[d.id]) {
				console.log("new element encountered twice:", el);
				return [];
			}
			if (el.group() == 'nodes' && d.id != null && d.id.match(/^newnode/)) {
				new_elements[d.id] = d;
			}
			else if (el.group() == 'edges' && d.id != null && d.id.match(/^newedge/)) {
				var src = cy.getElementById(d.source);
				var dst = cy.getElementById(d.target);
				if (!src) {
					console.log('edge source not found: ', d);
					return [];
				}
				if (!dst) {
					console.log('edge target not found: ', d);
					return [];
				}
				if (!new_elements[src.data().id]) {
					new_elements[src.data().id] = src.data();
				}
				if (!new_elements[dst.data().id]) {
					new_elements[dst.data().id] = dst.data();
				}
				new_elements[d.id] = el.data();
			}
		}
		var result = [];
		for (var i in new_elements) {
			result.push(new_elements[i])
		}
		debugger;
		return result;
	};

	var cy_delete_node = cym.cy_delete_node = function (el) {
		if (el.data().id.match(/^newnode/)) {
			console.log('deleting unsaved node:', el.data());
			el.remove();
			return;
		}
		else {
			var key = el && el.data().key;
			var node_type = el && el.data().node_type;
			if (!key || !node_type) {
				console.log("cannot delete a node without a key and a node_type");
				return;
			}
			console.log('deleting saved node:', el.data());
			main.delete_node(key, node_type);
		}
	}

	var cy_delete_edge = cym.cy_delete_edge = function (el) {
		if (el.data().id.match(/^newedge/)) {
			console.log('deleting unsaved edge:', el.data());
			el.remove();
			return;
		}
		else {
			var key = el && el.data().key;
			//var node_type = el && el.data().node_type;
			//if (!key || !node_type) {
			//	console.log("cannot delete a node without a key and a node_type");
			//	return;
			//}
			console.log('deleting saved edge:', el.data());
			main.delete_edge(el.data().id);
		}
	}



	var cy_get_classes = cym.cy_get_classes = function (ele) {
		var possible_classes = ['filtered notable'];
		var classes = [];
		for (var i = 0; i < possible_classes.length; i++) {
			if (ele.hasClass(possible_classes[i])) {
				classes.push(possible_classes[i]);
			}
		}
		return classes;
	}

	var activate_node = cym.activate_node = function(data) {
		highlight_url=data.url;
		var id = cy_find_element(data);
		var node = id ? cy.getElementById(id) : null;
		if (node) {
			choose_node(node);
		}
		mark_current_node(node);

	}


	var choose_node= cym.choose_node = function (ele) {
		console.log("choose_node");
		var d = ele.data();
		main.show_node_info(d, null, null, {
			degree: ele.degree(),
			node_classes: cy_get_classes(ele)
		});
	}

	var choose_edge = cym.choose_edge = function (edge) {
		console.log("choose_edge");
		var node, peer;
		node = cy.getElementById(edge.data().source);
		peer = cy.getElementById(edge.data().target);
		main.show_node_info(node.data(), edge.data(), peer.data(), {
			degree: node.degree(),
			node_classes: cy_get_classes(node),
			edge_classes: cy_get_classes(edge),
		});
	}


	var cy_find_element = cym.cy_find_element = function (filter) {
		var nodes= cy.nodes();
		if (filter.key=="") {
			filter.key=undefined
		}
		if (filter.url=="") {
			filter.url=undefined
		}
		var id;
		for (var i =0;i<nodes.length;i++) {
			var data=nodes[i].data()
			if (data.key && data.key==filter.key) {
				id = nodes[i].id()
				break;
			}
			if (data.url && data.url==filter.url) {
				id = nodes[i].id()
				break;
			}
		}
		return id;
	}

	//var cy_find_element_by_url= cym.cy_find_element_by_key = function (key) {
	//	var nodes= cy.nodes();
	//	var id;
	//	for (var i =0;i<nodes.length;i++) {
	//		var data=nodes[i].data()
	//		if (data.key==key) {
	//			id = nodes[i].id()
	//			break;
	//		}
	//	}
	//	return id;
	//}


	var mark_current_node  = function (node,force) {
		//var url = node ? node.data().url :null;
		//url = url == ""? null:url;
		//if (url) {
		//	if (highlight_url==node.data().url && !force) {
		//		return;
		//	}
		//	highlight_url=url;
		//}
		//else {
		//
		//}
		//
		if (current_url_node) {
			current_url_node.removeClass('current_url');
			//highlight_url = null;
		}
		current_url_node=node;
		if (node) {
			//highlight_url = node.data().url;
			current_url_node.addClass('current_url');
		}
	}



	var mark_current  = cym.mark_current = function (url,key,force) {
		if (highlight_url==url && !force) {
			return;
		}
		highlight_url=url;
		if (current_url_node) {
			current_url_node.removeClass('current_url');
			current_url_node=null;
		}

		var id = cy_find_element({url:url,key:key});
		if (!id) {
			return;
		}
		var node = cy.getElementById(id);
		//var nodes = cy.nodes();
		//var url_node, key_node;
		//for (var i = 0; i < nodes.length; i++) {
		//	if (nodes[i].data().url== url) {
		//		url_node =  nodes[i];
		//		break;
		//	}
		//	if (key && key !="" && nodes[i].data().key == key) {
		//		key_node= nodes[i];
		//	}
		//}
		current_url_node=node;
		if (current_url_node) {
			current_url_node.addClass('current_url');
		}
	}

	var cy_install_menu = function (cy) {
		cy.off('click');
		cy.on('click', "node, edge", function (event) {
			var node = event.cyTarget;
			if (node.group() == "nodes") {
				choose_node(node);
			}
			else if (node.group() == "edges") {
				choose_edge(node);
			}

		});
		if (cxtmenus) {
			var keys = Object.keys(cxtmenus);
			for (var i=0;i<keys.length;i++) {
				var menu=cxtmenus[keys[i]];
				if (menu) {
					menu.destroy();
				}
			}
			cxtmenus=undefined;
		}
		cxtmenus=cxtmenus||{};
		cxtmenus['node'] = cy.cxtmenu({
			selector: 'node',

			commands: [
				{
				content: '<span class="fa fa-flash fa-2x">connect</span>',
				select: function (ele) {
					connect_selected_to_node(ele);
				}
			},
			{
				content: '<span class="fa fa-flash fa-2x">go to</span>',
				select: function (ele) {
					switch_to_node_url(ele);
				}
			},
				{
				content: '<span class="fa fa-flash fa-2x">select</span>',
				select: function (ele) {
					choose_node(ele);
				}
			},

				{
				content: '<span class="fa fa-star fa-2x">delete</span>',
				select: function (ele) {
					cy_delete_node(ele);
				},
				disabled: false
			},

				{
				content: 'Text',
				select: function (ele) {
					console.log('element data:', ele.data());
				}
			}
			]
		});

		cxtmenus['edge'] = cy.cxtmenu({
			selector: 'edge',

			commands: [
				{
				content: '<span class="fa fa-flash fa-2x">select</span>',
				select: function (ele) {
					choose_edge(ele);
				}
			},
				{
				content: 'Text',
				select: function (ele) {
					console.log('element data:', ele);
				}
			},
				{
				content: '<span class="fa fa-star fa-2x">delete</span>',
				select: function (ele) {
					cy_delete_edge(ele);
				},
				disabled: false
			},

				]
		});


		cxtmenus['core'] = cy.cxtmenu({
			selector: 'core',

			commands: [
				{
				content: 'new node',
				select: function () {
					var offset = $("#cy").offset(),
						position = {
							x: window.event.pageX - offset.left,
							y: window.event.pageY - offset.top
						};
					var sel = cy.$('node:selected');

					connect_to_new_node(sel, {
						node_type: "topic",
						renderedPosition: {
							x: position.x,
							y: position.y
						},
					});


					//console.log( 'bg1' );
				}
			},

				{
				content: 'bg2',
				select: function () {
					console.log('bg2');
				}
			}
			]
		});
	}

	var text2html =function (text,tpl) {
		/* tpl = <p class="...">$$</p> */
		var html="";
		if (text==null){
			return html;
		}
		var match = text.match(/(.*)\r?\n/g);
		if (match !=null) {
			for (var i=0;i<match.length;i++) {
				html= html + tpl.replace('$$', match[i])
			}
		}
		return html;
	}

	var turn_hints_off = cym.turn_hints_off = function () {
		var qtips = $('.qtip');
		if (qtips.length ) {
			qtips.remove();
			return true;
		}
		return false;
	}

	var cy_install_hints = function (cy) {
		if (1 == 1) {
			cy.off('mouseover', 'node');
			cy.off('mouseover', 'edge');
			cy.on('mouseover', 'node', function (event) {
				console.log('mouseover on a node');
				var target = event.cyTarget;
				var sourceName = "source"; //target.data("source");
				var targetName = "target"; //target.data("target");
				var x = event.cyPosition.x;
				var y = event.cyPosition.y;
				var display_name= function (name) {
					var dname=name || "";
					//var rx = RegExp("%([a-f\\d]{2})","i");
					if (name.match("(%([a-f\\d]{2})){2}")) {
						dname = decodeURIComponent(name);
					}
					return dname.substring(0,100);
				}
				var display_comment= function (comment) {
					comment = comment||"";
					return comment.substring(0,100);
				}
				target.qtip({
					content: {
						text: function () {
							return '' + '<div> '
							+ target.data().ts + '<br/>'
							+ 'degree: ' + target.data().degree + '<br/>'
							+ 'node type: ' + target.data().node_type + '<br/>' + display_name(target.data().name) + '<br/>'
							+ display_comment(target.data().comment) + '<br/>'
							//+ target.data().relevance
							//	? 'relevance: ' + '<span class="hintdata">'+ text2html(target.data().relevance, '$$<br/>') + '</span>'
							//	: ''
							+ (target.data().relevance ? '<span class="hintdata">'+ main.relevance_html(target.data().relevance) + '</span>' : '')
							+ '</div>'
						}
					},
					show: {
						solo: true,
						delay: 10,
						event: false,
						ready: true,
						effect: false,

					},
					///*
					position: {
						my: 'top',
						at: 'right',
						adjust: {
							mouse: true
						},

						//target: [x+3, y+3],
						adjust: {
							x: 0,
							y: 0
						}

					},
					hide: {

						when: {
							event: 'mousemove'
						},
						//delay: 2000,
						//fixed: true,
						//event: false,
						//inactive: 2000,
						inactive: false,

					},

					style: {
						//classes: 'ui-tooltip-shadow ui-tooltip-youtube',
						tip: {
							corner: false,
							width: 24,
							// resize the caret
							height: 24 // resize the caret
						}

					}
				});

			});

			cy.on('mouseover', 'edge', function (event) {
				console.log('mousedown on an edge');
				var target = event.cyTarget;
				var sourceName = "source"; //target.data("source");
				var targetName = "target"; //target.data("target");
				var x = event.cyPosition.x;
				var y = event.cyPosition.y;

				target.qtip({
					content: {
						text: function () {
							return '' + '<div> ' + target.data().edge_type + ': ' + target.data().id + '</div>'
						}
					},
					show: {
						solo: true,
						delay: 10,
						event: false,
						ready: true,
						effect: false

					},
					position: {
						my: 'top left',
						at: 'bottom right',
						adjust: {
							mouse: true
						},

						//target: [x+3, y+3],
						adjust: {
							x: 0,
							y: 0
						}

					},
					hide: {

						when: {
							event: 'mousemove'
						},
						//delay: 2000
						fixed: true,
						//event: false,

						//inactive: 2000,
						inactive: false,

					},

					style: {
						//classes: 'ui-tooltip-shadow ui-tooltip-youtube',
						tip: {
							corner: false,
							width: 24,
							// resize the caret
							height: 24 // resize the caret
						}

					}
				});

			});

		}
	}

	var cy_add_metadata = function (nodes) {
		nodes = nodes || cy.nodes();
		for (var i = 0; i < nodes.length; i++) {
			var deg = nodes[i].degree();
			if (nodes[i].data().node_type == 'topic') {
				deg = 20;
			}
			nodes[i].data().degree = deg;
			//console.log(i+" is  " + nodes[i].data().node_type);
			if (deg > 20) {
				deg = 20
			}
			nodes[i].scratch('hsl', rainbow(nodes[i].degree() / 20 * 255));

			//console.log( 'degree of '+nodes[i].data().id + ' : '  + deg);
		}
	}

	cym.cy_get_colors = function () {
		return {
			edge_colors: config_data.edge_colors
		};
	}

	cym.cy_reload = function (json,merge) {
		//qtip_ensure();
		cy_config.container = document.getElementById('cy');
		cy_config2.container = document.getElementById('cy_scratch');
		//cy = cytoscape(cy_config);
		//var cy2 = cytoscape(cy_config2);
		var cy2;
		current_url_node=null;

		//!!!!!!!!
		var post_process = function () {
			cy.nodes().addClass('ids');
			cy_add_metadata(cy.nodes());
			add_style(cy.style(), styles['base_style']);
			add_style(cy.style(), styles['graph_style']);
			add_style(cy.style(), styles['class_style']);
			add_style(cy.style(), styles['edge_style']);
			add_style(cy.style(), styles['gui_style']);
			cy.style().update();
			cy_install_menu(cy);
			cy_install_hints(cy);

			if (highlight_url) {
				var data = query_graph_common.derive_data({url: highlight_url});

				activate_node(data);
				//mark_current(highlight_url, data.key, 1);
			}

			if (cy.nodes().length) {
				cy.layout(lay_options[config_data.default_layout]);
			}
		};

		if (json) {
			if (merge) {
				if (1==0 ) {
					cy2.remove(cy2.elements());
					cy2.load(json,undefined, function () {
						cy.batch(function() {
							cy.add(cy2.elements());
							post_process();
							cy2.destroy();
						})
					})
				}
				else {
					cy.add(json);
					cy.ready(post_process);
				}
			}
			else {
				cy.destroy();
				cy = cytoscape(cy_config);
				cy.load(json, undefined, function () {
					cy.batch(post_process)
				});
				1 == 0 && cy.batch(function () {
					cy.remove('node,edge');
					cy.load(json, undefined, post_process);
				});
			}

		}
		else {
			cy.batch(post_process());
		}
	};


	////////////////// startup
	//$(document).ready(function() {
	cym.install_handlers = function () {
		$('#edit_range_start').mousedown(function (e) {
			console.log("adhoc: ", e);
		});
		$('#edit_range_start').contextmenu(function (e) {
			console.log("adhoc: ", e);
		});


		$('#cy_load_scratch_data').click(function () {
			if (_debug) debugger;
			cy.load(cydata3.elements, undefined, function () {
				cy.batch(function () {
					cy.nodes().addClass('ids');
					cy_add_metadata();
					cy.layout(lay_options[config_data.default_layout]);
				});
			});
		});
		$('#cy_toggle_names').click(function () {

			var nodes = cy.nodes();
			for (var i = 0; i < nodes.length; i++) {
				console.log('degree of ' + nodes[i].data().id + ' : ' + nodes[i].degree());
			}
			cy.batch(function () {
				cy.nodes().toggleClass('ids').toggleClass('names');
				//cy.layout(lay_options);
				var j = $('#cy_toggle_names');
				j.val("names" == j.val() ? "ids" : "names");
			});
			console.log("toggled");
		});

		$('#cy_switch_layout').click(function () {
			var i;
			for (i = 0; i < lay_options.length; i++) {
				if (lay_options[i]['name'] == current_layout) {
					break;
				}
			}
			i = (i + 1) % lay_options.length;
			if (_cy_debug) {
				debugger;
			}
			if (i >= lay_options.length) {
				i = 0;
			}
			current_layout = lay_options[i]['name'];
			console.log("switching to layout: " + current_layout);
			cy.layout(lay_options[i]);

		});

/*

    cy.on('click','node', function(event){
          var target = event.cyTarget;
          var sourceName = "source";//target.data("source");
          var targetName = "target"; //target.data("target");

          var x=event.cyPosition.x;
          var y=event.cyPosition.y;


              $("#box").qtip({
                content: {
                  title:targetName,
                  text: sourceName
                },
                show: {
                  delay: 0,
                  event: false,
                  ready: true,
                  effect:false

                },
                position: {
                  my: 'bottom center',
                  at: 'top center',

                  target: [x+3, y+3],
                  adjust: {
                    x: 7,
                    y:7

                  }

                },
                hide: {
                  fixed: true,
                  event: false,
                  inactive: 2000

                },


                style: {
                  classes: 'ui-tooltip-shadow ui-tooltip-youtube',

                  tip:
                  {
                    corner: true,
                    width: 24,         // resize the caret
                    height: 24         // resize the caret
                  }

                }

            })
          });

  //*/

/*
    1==0 && cy.elements().qtip({
      content: function(){ return 'Example qTip on ele ' + this.id() },
      position: {
        my: 'top center',
        at: 'bottom center'
      },
      style: {
        classes: 'qtip-bootstrap',
        tip: {
          width: 16,
          height: 8
        }
      }
      , show :  {
        event : 'mouseover'
      }
    });

  */
	}

	cym.init_combobox = function () {
		$(document).ready(function () {
			var switch_layout = function (e, ui) {
				debugger;
				var t = ui.value;
				if (t != undefined && t != "") {
					for (var i = 0; i < lay_options.length; i++) {
						if (lay_options[i]['name'] == t) {
							break;
						}
					}
					if (i < lay_options.length) {
						cy.layout(lay_options[i]);
					}
				}
			};
			var cbb = $("#layout_dropdown_combobox").combobox({
				select: switch_layout,
				change: switch_layout
			});

			//var cbb= $('#layout_dropdown_combobox');
			cbb.children('option').remove();
			for (i = 0; i < lay_options.length; i++) {
				cbb.append($("<option />").val(lay_options[i]['name']).text(lay_options[i]['name']));
			}
		});

	}

	cym.init = function () {
    $(document).ready(function () {
      cy_config.container = document.getElementById('cy');
			cy_config2.container = document.getElementById('cy_scratch');
      cy = cytoscape(cy_config);


      (function () {
        cy.batch(function () {
          cy.nodes().addClass('ids');
          cy_add_metadata(cy.nodes());
          add_style(cy.style(), styles['base_style']);
          add_style(cy.style(), styles['graph_style']);
          add_style(cy.style(), styles['class_style']);
          add_style(cy.style(), styles['edge_style']);
          add_style(cy.style(), styles['gui_style']);
          cy.style().update();
          cy_install_menu(cy);
          cy_install_hints(cy);
          if (cy.nodes().length) {
            cy.layout(lay_options[config_data.default_layout]);
          }
        });
      })();

      cym.install_handlers();
      cym.init_combobox();
    });
		//cydata2.container = document.getElementById('cy');
		//cy = cytoscape (cydata2);
	};

})(main.cym);