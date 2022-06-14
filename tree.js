"use strict";

// override defaults for text editing with Jack textarea
document.getElementById('jackTextArea')
    .addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            this.value = `${this.value.substring(0, start)}  ${this.value.substring(end)}`;
            this.selectionStart = this.selectionEnd = start + 2;
        }
    });


function makeTree(xmlStr) {
    // xmlStr to xmlDoc
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlStr, "text/xml");

    // TODO:
    // handle parseerror:
    // https://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
    
    const svg = d3.select('svg');
    // clear existing svg
    svg.selectAll("*").remove();
    
    const width = document.getElementById("tree-canvas").offsetWidth;
    const height = document.getElementById("tree-canvas").offsetHeight;
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    // const innerWidth = width - margin.left - margin.right;
    // const innerHeight = height - margin.top - margin.bottom;
    const tree = d3.tree()
        .nodeSize([50, 100])
        .separation(function(a,b) { return a.parent == b.parent ? 2 : 3});
    
    const zoomG = svg
        .attr('width', width)
        .attr('height', height)
        .append('g');
    
    const g = zoomG.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    svg.call(d3.zoom().on('zoom', (event) => {
        zoomG.attr('transform', event.transform);
    }))
    
    const root = d3.hierarchy(xmlDoc);
    const links = tree(root).links();
    
    console.log(root.separation)

    // links
    g.selectAll('path').data(links)
        .enter()
        .append('path')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        )

    const nodes = g.append('g')
        .selectAll('g')
        .data(root.descendants())
        .join('g');

    function getTextLength(d) {
        var tagNameLength = d.data.tagName.length;
        var innerHTMLLength = d.children ? 0 : d.data.innerHTML.length;
        return tagNameLength > innerHTMLLength ? tagNameLength*10 : innerHTMLLength*10;
    }

    nodes.append('rect')
        .attr('x', d => d.data.tagName ? d.x - getTextLength(d)/2 : d.x)
        .attr('y', d => d.y - 15)
        .attr('width', d => d.data.tagName ? getTextLength(d) : null)
        .attr('height', 35)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    // tagName text
    nodes.append('text')
        .style('font', '12px courier')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr("text-anchor", "middle")
        .text(d => d.data.tagName);

    // innerHTML text
    nodes.append('text')
        .style('font', '12px courier')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .text(d => d.children ? null : d.data.innerHTML);
}

function getXmlStr() {
    var currentXmlStr = document.getElementById("xmlText").value;
    if (currentXmlStr != xmlStr) {
        console.log(currentXmlStr);
        makeTree(currentXmlStr);
        xmlStr = currentXmlStr;
    }
}

var xmlStr = ""; // initialize global xmlStr var
setInterval(getXmlStr, 500);
