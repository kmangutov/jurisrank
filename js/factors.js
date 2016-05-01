
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

var highlights = [];//{start:x, length:y, factor:i, case:z}
var root = $("#list-factors");


var defaultHTMLs = {};
var loadDefaultHTMLs = function() {
  $("[data-case]").each(function f() {
    var id = $(this).data('case');
    defaultHTMLs[id] = $(this).html();
  });
}

loadDefaultHTMLs();

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

var onTestSelect = function(id) {
  if(selectedFactor == -1) {
    console.log("No factor selected");
    return;
  }

  var selection = getSelectionText();

  if(selection.length < 8) {
    console.log("selection too short");
    return;
  }

  //var html = testCase.html();
  var defaultHTML = defaultHTMLs[id];
  var startIndex = defaultHTML.indexOf(selection);
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
    text: selection,
    case: id
  };
  highlights.push(obj);
  console.log(JSON.stringify(highlights));

  renderFactors();
  renderTestCase();
}

$("[data-case]").mouseup(function(){ 
  var id = $(this).data('case');
  console.log("case: " + id);

  onTestSelect(id); 
});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var renderTestCase = function() {
  //defaultTestCaseHTML 

  $("[data-case]").each(function f() {
    var id = $(this).data('case');
    finalHtml = defaultHTMLs[id];

    var offset = 0;
  
    highlights.forEach(function(obj){ 

      if(obj.case == id) {

        var insert = "<span style='background-color:" + colors[obj.factor % colors.length] + "'>" + obj.text + "</span>";
        finalHtml = replaceAll(finalHtml, obj.text, insert);
      }
    });

    $(this).html(finalHtml);
  });
}

var renderFactors = function() {
  root.empty();
  for(var i = 0; i < factors.length; i++) {

    console.log("factor: " + i)

    var node = $("<tr>");
    var td = $("<td>");
    var text = $("<span>");

    if(i == selectedFactor) {
      text.addClass("factor-selected");
    }

    td.css("background-color", colors[i % colors.length]);
    td.css("text-align", "center");
    text.css("text-size", "22px !important")
    text.html(factors[i] + "<br>");
    text.click(makeFunctionCallI(factorSelect, i));
    //node.append(text);
    td.append(text);
    node.append(td);

    var hRoot = $("<table>");
    var count = 0;

    var trA = $("<tr>");

    var thA = $("<th>");
    thA.html("Case");

    var thB = $("<th>");
    thB.html("Support");

    trA.append(thA)
    trA.append(thB)
    hRoot.append(trA);


    var sortedH = highlights.sort(function(a, b) {
      return a.case - b.case;
    });

    for(var j = 0; j < highlights.length; j++) {
      if(sortedH[j].factor == i) {
        count++;
        var _td = $("<tr>");

        var titleCase = function(caseId) {
          var names = ['Test', 'IC 1', 'IC 2', 'E 1', 'E 2'];
          return names[caseId];
        }

        var a = $("<td>");
        a.html(titleCase(sortedH[j].case));

        var b = $("<td>");
        b.html(sortedH[j].text);

        _td.append(a);
        _td.append(b);
        hRoot.append(_td)

        var _td2 = $("<tr>");
        var a2 = $("<td>");
        var b2 = $("<td>");

        var slider = $("<input>");
        slider.prop("type", "range");
        slider.prop("min", "0");
        slider.prop("max", "10");
        slider.prop("step", "1");
        slider.prop("value", "5");

        var b2_center = $("<center>");

        var textIC = $("<span>")
        textIC.html("IC&nbsp;");

        var textE = $("<span>")
        textE.html("&nbsp;E");


        b2_center.append(textIC);
        b2_center.append(slider);
        b2_center.append(textE);
        b2.append(b2_center);


        _td2.append(a2);
        _td2.append(b2);


        hRoot.append(_td2);
      }
    }
    

    if(count > 0) {
      console.log(JSON.stringify(hRoot));
      td.append(hRoot);
    }
    root.append(node);    
  }
}

renderFactors();
renderTestCase();