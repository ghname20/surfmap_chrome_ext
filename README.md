# surfmap\_chrome\_ext
## A chrome extension to work with surfmapper

**Surfmapper** is a project designed to keep track of browsing history and visualize it in a node graph.  
The project's main incentive was to handle huge navigation graphs outside of the browser, because otherwise it would hog too much memory.  

This chrome extension provides UI for the project.  
It stores history of searches (currently Google search) and user navigation in the dedicated surfmap\_storage system.  
It allows to run queries against the storage and visualizes the results using Cytoscape.js library.  
It also provides means for editing the graph, including adding, deleting, commenting, rating nodes.  
Interaction with the storage is done through the SOAP server (surfmap\_server).

![alt tag] (info/images/pf1_chrome_ext.jpg "A screenshot of the extension main page") 

Currently I have no time to describe it in detail or work out some installation procedure.
