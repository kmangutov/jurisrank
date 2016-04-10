
var colors = ['#ffb7b7', '#a8d1ff', '#fff2a8', '#b3ff99', '#9999ff', '#99e6ff', '  #cc99ff', '#ff99e6'];

var factors = ["Distinct from principal",
"Part of regular business",
"Tool supplier",
"Investment in equipment",
"Requires special skill",
"Work Usually Supervised",
"Opportunity for profit depending on managerial skill",
"Length of time",
"Permanence of working relationship",
"Payment by time or by job",
"Belief of employer-employee relationship"]

var highlights = [];//{start:x, length:y, factor:i}
var root = $("#list-factors");
var testCase = $("#case-test");
var defaultTestCaseHTML = "";

var selectedFactor = -1;
var gunkLength = 0;


var factorSelect = function(id) {
  selectedFactor = id;
  renderFactors();
}

var makeFunctionCallI = function(f, i) {
  return function() {
    f(i);
  }
}


function getSelectionText() {
  var text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  return text;
}

var onTestSelect = function() {
  if(selectedFactor == -1) {
    console.log("No factor selected");
    return;
  }

  var selection = getSelectionText();

  if(selection.length < 8) {
    console.log("selection too short");
    return;
  }

  var html = testCase.html();
  var startIndex = defaultTestCaseHTML.indexOf(selection);
  var endIndex = startIndex + selection.length;

  /*console.log(selection);
  console.log("startIndex: " + startIndex);
  console.log("endIndex: " + endIndex);
  var endHtml = html.slice(0, startIndex) + "<span>" + selection + "</span>" + html.slice(endIndex);
  testCase.html(endHtml);*/

  var obj = {
    startIndex: startIndex,
    length: selection.length,
    factor: selectedFactor,
    text: selection
  };
  highlights.push(obj);
  console.log(JSON.stringify(highlights));

  renderFactors();
  renderTestCase();
}

$("#case-test").mouseup(function(){ onTestSelect(); });

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var renderTestCase = function() {
  //defaultTestCaseHTML 

  var finalHtml = defaultTestCaseHTML;
  var offset = 0;
  
  highlights.forEach(function(obj){ 

    var insert = "<span style='background-color:" + colors[obj.factor % colors.length] + "'>" + obj.text + "</span>";
    finalHtml = replaceAll(finalHtml, obj.text, insert);

    /*var insert = "<b>" + obj.text + "</b>";
    var impact = insert.length - obj.text.length;

    var startIndex = obj.startIndex + offset
    var endIndex = obj.startIndex + offset + obj.length;

    console.log("stratIndex " + startIndex + ", endIndex " + endIndex);

    finalHtml = finalHtml.slice(0, startIndex) + insert + finalHtml.slice(endIndex);

    offset += impact;
    gunkLength += impact;*/
  });

  //console.log(finalHtml);

  testCase.html(finalHtml);
}

var renderFactors = function() {
  root.empty();
  for(var i = 0; i < factors.length; i++) {
    var node = $("<li>");
    var text = $("<span>");

    if(i == selectedFactor) {
      text.addClass("factor-selected");
    }

    text.css("background-color", colors[i % colors.length]);
    text.html(factors[i]);
    node.click(makeFunctionCallI(factorSelect, i));
    node.append(text);

    var hRoot = $("<ol>");

    for(var j = 0; j < highlights.length; j++) {
      if(highlights[j].factor == i) {
        var h = $("<li>");
        h.html(highlights[j].text);
        hRoot.append(h);
      }
    }
    /*highlights.forEach(function(obj) {
      console.log("CONSIDER highlight for factor " + obj.factor);
      if(obj.factor == i) {
        var h = $("li");
        h.html(obj.text);
        hRoot.append(h);
        console.log("APPEND factor " + i + ", highlight " + hc);
        hc++;
      }
    });*/
    /*forEachHighlight(i, function(obj) {
      console.log("factor " + i + " has highlight " + obj.text);
      var h = $("li");
      h.text(obj.text);
      hRoot.append(h);
    });*/
    /*forEachHighlight(i, function(obj) {
      var h = $("li");
      h.html(obj.text);
      hRoot.append(h);
    });
    node.append(hRoot);*/

    root.append(node);    
    node.append(hRoot);

  }
}

defaultTestCaseHTML = testCase.html();
renderFactors();
renderTestCase();