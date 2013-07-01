/*
 * Copyright (c) 2012 Memorial Sloan-Kettering Cancer Center.
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation; either version 2.1 of the License, or
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  The software and
 * documentation provided hereunder is on an "as is" basis, and
 * Memorial Sloan-Kettering Cancer Center
 * has no obligations to provide maintenance, support,
 * updates, enhancements or modifications.  In no event shall
 * Memorial Sloan-Kettering Cancer Center
 * be liable to any party for direct, indirect, special,
 * incidental or consequential damages, including lost profits, arising
 * out of the use of this software and its documentation, even if
 * Memorial Sloan-Kettering Cancer Center
 * has been advised of the possibility of such damage.  See
 * the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library; if not, write to the Free Software Foundation,
 * Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA.
 */

var PlotsCustomMenu = (function(){

    var content = {
        plots_type_list : [
            { value : "mrna", name :  "mRNA Expression" },
            { value : "copy_no", name :  "Copy Number Alteration" },
            { value : "methylation", name :  "DNA Methylation" },
            { value : "rppa", name :  "RPPA Protein Level" }
        ],
        genetic_profile_mutations : [],
        genetic_profile_mrna : [],
        genetic_profile_copy_no : [],
        genetic_profile_rppa : [],
        genetic_profile_dna_methylation : []
    };

    function fetchFrameData() {
        content.genetic_profile_mutations = Plots.getGeneticProfiles().genetic_profile_mutations;
        content.genetic_profile_mrna = Plots.getGeneticProfiles().genetic_profile_mrna;
        content.genetic_profile_copy_no = Plots.getGeneticProfiles().genetic_profile_copy_no;
        content.genetic_profile_dna_methylation = Plots.getGeneticProfiles().genetic_profile_dna_methylation;
        content.genetic_profile_rppa = Plots.getGeneticProfiles().genetic_profile_rppa;
    }

    function appendDropDown(divId, value, text) {
        $(divId).append("<option value='" + value + "'>" + text + "</option>");
    }

    function dataIsDiscretized(profileText) {
        if (profileText.indexOf("GISTIC") !== -1 ||
            profileText.indexOf("RAE") !== -1) {
            return true;
        }
        return false;
    }

    function generateList(selectId, options) {
        var select = document.getElementById(selectId);
        options.forEach(function(option){
            var el = document.createElement("option");
            el.textContent = option;
            el.value = option;
            select.appendChild(el);
        });
    }

    function updateXselection() {
        $("#custom_platform_select_div_x").empty();
        $("#custom_platform_select_div_x").append("<select id='custom_platform_x' onchange='PlotsCustomView.init()'>");

        if($("#custom_plots_type_x").val() === "mrna"){
            content.genetic_profile_mrna.forEach (function (profile) {
                $("#custom_platform_x")
                    .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
            });
        } else if($("#custom_plots_type_x").val() === "copy_no"){
            content.genetic_profile_copy_no.forEach (function (profile) {
                if (!dataIsDiscretized(profile[1])) {  //No listing of discretized data type (profile)
                    $("#custom_platform_x")
                        .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
                }
            });
        } else if($("#custom_plots_type_x").val() === "methylation"){
            content.genetic_profile_dna_methylation.forEach (function (profile) {
                $("#custom_platform_x")
                    .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
            });
        } else if($("#custom_plots_type_x").val() === "rppa"){
            content.genetic_profile_rppa.forEach (function (profile) {
                $("#custom_platform_x")
                    .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
            });
        }

    }

    function updateYselection() {
        $("#custom_platform_select_div_y").empty();
        $("#custom_platform_select_div_y").append("<select id='custom_platform_y' onchange='PlotsCustomView.init()'>");

        if($("#custom_plots_type_y").val() === "mrna"){
            content.genetic_profile_mrna.forEach (function (profile) {
                $("#custom_platform_y")
                    .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
            });
        } else if($("#custom_plots_type_y").val() === "copy_no"){
            content.genetic_profile_copy_no.forEach (function (profile) {
                if (!dataIsDiscretized(profile[1])) {  //No listing of discretized data type (profile)
                    $("#custom_platform_y")
                        .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
                }
            });
        } else if($("#custom_plots_type_y").val() === "methylation"){
            content.genetic_profile_dna_methylation.forEach (function (profile) {
                $("#custom_platform_y")
                    .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
            });
        } else if($("#custom_plots_type_y").val() === "rppa"){
            content.genetic_profile_rppa.forEach (function (profile) {
                $("#custom_platform_y")
                    .append("<option value='" + profile[0] + "'>" + profile[1] + "</option>");
            });
        }
    }

    return {
        init: function() {

            fetchFrameData();

            generateList("custom_geneX", gene_list);
            //shift the genelist (temporary solution)
            //TODO:
            var tmp_gene_holder = gene_list.pop();
            gene_list.unshift(tmp_gene_holder);

            generateList("custom_geneY", gene_list);
            content.plots_type_list.forEach( function(plots_type) {
                appendDropDown("#custom_plots_type_x", plots_type.value, plots_type.name);
            });
            content.plots_type_list.forEach( function(plots_type) {
                appendDropDown("#custom_plots_type_y", plots_type.value, plots_type.name);
            });

        },
        update: function(){
            updateXselection();
            updateYselection();
            PlotsCustomView.init();
        }
    };
}());

var PlotsCustomView = (function() {
    //Extracted data from JSON for plotting
    //Dots collection
    var pData = {
            case_set_length : 0,
            dotsData : []
        },
    //The template for creating dot unit
        singleDot = {
            case_id : "",
            x_value : "",
            y_value : "",
            annotation: ""  //Mutation (for now)
        },
    //Current Selection from the menu
        menu = {
            geneX : "",
            geneY : "",
            plots_type_x: "",
            plots_type_y: "",
            genetic_profile_id_x: "",
            genetic_profile_id_y: ""
        },
    //Canvas Settings
        settings = {
            canvas_width: 720,
            canvas_height: 600
        },
    //DOMs
        elem = {
            svg : "",
            xScale : "",
            yScale : "",
            xAxis : "",
            yAxis : "",
            dotsGroup : ""
        },
        style = {
            geneX_mut : {
                fill : "#31B404",
                stroke : "#298A08",
                text : "GeneX Mutated"
            },
            geneY_mut : {
                fill : "#2E64FE",
                stroke : "#013ADF",
                text : "GeneY Mutated"
            },
            both_mut : {
                fill : "#FF0000",
                stroke : "#B40404",
                text : "Both Mutated"
            },
            non_mut : {
                fill : "#585858",
                stroke : "#2E2E2E",
                text : "Non Mutated"
            }
        };

    function pDataInit(result) {
        var tmp_singleDot = {
            case_id : "",
            value: "",
            annotation: ""
        };
        var tmp_pDataX = [];
        var tmp_pDataY = [];
        pData.dotsData.length = 0;
        pData.case_set_length = 0;
        for (var gene in result) {
            if (gene === menu.geneX) {
                var geneObj = result[gene];
                for (var case_id in geneObj) {
                    var obj = geneObj[case_id];
                    var new_tmp_singleDot = jQuery.extend(true, {}, tmp_singleDot);
                    new_tmp_singleDot.case_id = case_id;
                    for (var i = 0; i < Object.keys(obj).length; i++) {
                        if (Object.keys(obj)[i] === menu.genetic_profile_id_x) {
                            var tmp_profile_x_index = i;
                        }
                    }
                    var tmp_profile_annotation_index = Object.keys(obj).length - 1;
                    new_tmp_singleDot.value = obj[Object.keys(obj)[tmp_profile_x_index]];
                    new_tmp_singleDot.annotation = obj[Object.keys(obj)[tmp_profile_annotation_index]];//mutation
                    tmp_pDataX.push(new_tmp_singleDot);
                }
            } else if (gene === menu.geneY) {
                var geneObj = result[gene];
                for (var case_id in geneObj) {
                    var obj = geneObj[case_id];
                    var new_tmp_singleDot = jQuery.extend(true, {}, tmp_singleDot);
                    new_tmp_singleDot.case_id = case_id;
                    for (var i = 0; i < Object.keys(obj).length; i++) {
                        if (Object.keys(obj)[i] === menu.genetic_profile_id_y) {
                            var tmp_profile_y_index = i;
                        }
                    }
                    var tmp_profile_annotation_index = Object.keys(obj).length - 1;
                    new_tmp_singleDot.value = obj[Object.keys(obj)[tmp_profile_y_index]];//profile id
                    new_tmp_singleDot.annotation = obj[Object.keys(obj)[tmp_profile_annotation_index]];//mutation
                    tmp_pDataY.push(new_tmp_singleDot);
                }
            }
        }

        //merge tmp_pDataX, tmp_pDataY, and filter NaN/NA data
        for (var i = 0; i < tmp_pDataY.length; i++) {
            if (tmp_pDataX[i].value !== "NaN" && tmp_pDataX[i].value !== "NA" &&
                tmp_pDataY[i].value !== "NaN" && tmp_pDataY[i].value !== "NA") {

                pData.case_set_length += 1;

                var new_singleDot = jQuery.extend(true, {}, singleDot);
                new_singleDot.case_id = tmp_pDataX[i].case_id;
                new_singleDot.x_value = tmp_pDataX[i].value;
                new_singleDot.y_value = tmp_pDataY[i].value;
                //Mutation: process single/multi gene mutation
                var tmp_annotation_str = "";
                if (tmp_pDataX[i].annotation !== "NaN") {
                    tmp_annotation_str +=
                        menu.geneX + ": " + tmp_pDataX[i].annotation + " ";
                }
                if (tmp_pDataY[i].annotation !== "NaN") {
                    tmp_annotation_str +=
                        menu.geneY + ": " + tmp_pDataY[i].annotation;
                }
                new_singleDot.annotation = tmp_annotation_str.trim();
                pData.dotsData.push(new_singleDot);
            }
        }
    }

    function initCanvas() {
        $('#plots_box_custom').empty();
        elem.svg = d3.select("#plots_box_custom")
            .append("svg")
            .attr("width", settings.canvas_width)
            .attr("height", settings.canvas_height);
    }

    function getUserSelection() {
        menu.geneX = document.getElementById("custom_geneX").value;
        menu.geneY = document.getElementById("custom_geneY").value;
        menu.plots_type_x = document.getElementById("custom_plots_type_x").value;
        menu.plots_type_y = document.getElementById("custom_plots_type_y").value;
        menu.genetic_profile_id_x = document.getElementById("custom_platform_x").value;
        menu.genetic_profile_id_y = document.getElementById("custom_platform_y").value;
    }

    function generatePlots() {
        getProfileData();
    }

    function getProfileData() {
        Plots.getProfileData(
            menu.geneX + " " + menu.geneY,
            menu.genetic_profile_id_x + " " + menu.genetic_profile_id_y + " " + cancer_study_id + "_mutations",
            case_set_id,
            getProfileDataCallBack
        );
    }

    function analyseData() {
        var tmp_xData = [];
        var tmp_xIndex = 0;
        var tmp_yData = [];
        var tmp_yIndex = 0;
        for (var j = 0; j< pData.case_set_length; j++){
            if (pData.dotsData[j].x_value !== "NaN" && pData.dotsData[j].y_value !== "NaN" &&
                pData.dotsData[j].x_value !== "NA" && pData.dotsData[j].y_value !== "NA") {
                tmp_xData[tmp_xIndex] = pData.dotsData[j].x_value;
                tmp_xIndex += 1;
                tmp_yData[tmp_yIndex] = pData.dotsData[j].y_value;
                tmp_yIndex += 1;
            }
        }
        var min_x = Math.min.apply(Math, tmp_xData);
        var max_x = Math.max.apply(Math, tmp_xData);
        var edge_x = (max_x - min_x) * 0.2;
        var min_y = Math.min.apply(Math, tmp_yData);
        var max_y = Math.max.apply(Math, tmp_yData);
        var edge_y = (max_y - min_y) * 0.1;
        return {
            min_x: min_x,
            max_x: max_x,
            edge_x: edge_x,
            min_y: min_y,
            max_y: max_y,
            edge_y: edge_y
        };
    }

    function initAxis() {

        var analyseResult = analyseData();
        var min_x = analyseResult.min_x;
        var max_x = analyseResult.max_x;
        var edge_x = analyseResult.edge_x;
        var min_y = analyseResult.min_y;
        var max_y = analyseResult.max_y;
        var edge_y = analyseResult.edge_y;

        ///TODO: Hide html value "methylation"
        ///funciton() datatypeIsMethylation
        var rangeXmin = min_x - edge_x;
        var rangeXmax = max_x + edge_x;
        var rangeYmin = min_y - edge_y;
        var rangeYmax = max_y + edge_y;
        if (menu.plots_type_x === "methylation") { //Fix the range for methylation data
            rangeXmin = -0.02;
            rangeXmax = 1;
        }
        if (menu.plots_type_y === "methylation") {
            rangeYmin = -0.02;
            rangeYmax = 1;
        }
        elem.xScale = d3.scale.linear()
            .domain([rangeXmin, rangeXmax])
            .range([100, 600]);
        elem.yScale = d3.scale.linear()
            .domain([rangeYmin, rangeYmax])
            .range([520, 20]);

        elem.xAxis = d3.svg.axis()
            .scale(elem.xScale)
            .orient("bottom")
        elem.yAxis = d3.svg.axis()
            .scale(elem.yScale)
            .orient("left");

    }

    function drawAxis() {
        var svg = elem.svg;
        svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(0, 520)")
            .call(elem.xAxis)
            .selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("stroke-width", 0.5)
            .style("stroke", "black")
            .style("fill", "black");
        svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(0, 20)")
            .call(elem.xAxis.orient("bottom").ticks(0));
        svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(100, 0)")
            .call(elem.yAxis)
            .selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("stroke-width", 0.5)
            .style("stroke", "black")
            .style("fill", "black");
        svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(600, 0)")
            .call(elem.yAxis.orient("left").ticks(0));
    }

    function drawPlots() {

        //sort DotsData
        var tmp_dotsData = pData.dotsData;
        var nonMutatedData = [];
        var mutatedData= [];
        var dataBuffer = [];

        tmp_dotsData.forEach (function(entry) {
            if (entry.annotation !== "") {
                mutatedData.push(entry);
            } else {
                nonMutatedData.push(entry);
            }
        });

        nonMutatedData.forEach (function(entry) {
            dataBuffer.push(entry);
        });
        mutatedData.forEach (function(entry) {
            dataBuffer.push(entry);
        });
        tmp_dotsData = dataBuffer;

        var showMutation = document.getElementById("show_mutation_custom_view").checked;
        elem.dotsGroup = elem.svg.append("svg:g");
        elem.dotsGroup.selectAll("path")
            .data(tmp_dotsData)
            .enter()
            .append("svg:path")
            .attr("transform", function(d){
                return "translate(" + elem.xScale(d.x_value) + ", " + elem.yScale(d.y_value) + ")";
            })
            .attr("d", d3.svg.symbol()
                .size(25)
                .type("circle"))
            .attr("fill", function(d) {
                if (showMutation) {
                    if (d.annotation === "") {
                        return style.non_mut.fill;
                    } else {
                        var count = d.annotation.split(":").length - 1;
                        if (count === 1) { //single mut
                            if (d.annotation.indexOf(menu.geneX) !== -1) {
                                return style.geneX_mut.fill;
                            } else if (d.annotation.indexOf(menu.geneY) !== -1) {
                                return style.geneY_mut.fill;
                            }
                        } else if (count === 2) { //both mut
                            return style.both_mut.fill;
                        }
                    }
                } else {
                    return style.non_mut.fill;
                }
            })
            .attr("stroke", function(d) {
                if (showMutation) {
                    if (d.annotation === "") {
                        return style.non_mut.stroke;
                    } else {
                        var count = d.annotation.split(":").length - 1;
                        if (count === 1) { //single mut
                            if (d.annotation.indexOf(menu.geneX) !== -1) {
                                return style.geneX_mut.stroke;
                            } else if (d.annotation.indexOf(menu.geneY) !== -1) {
                                return style.geneY_mut.stroke;
                            }
                        } else if (count === 2) { //both mut
                            return style.both_mut.stroke;
                        }
                    }
                } else {
                    return style.non_mut.stroke;
                }
            })
            .attr("stroke-width", function(d) {
                return "1.2";
            });
    }

    function drawLegends() {
        var showMutation = document.getElementById("show_mutation_custom_view").checked;
        if (showMutation) {
            var twoGenesStyleArr = [];
            for (var key in style) {
                var obj = style[key];
                twoGenesStyleArr.push(obj);
            }

            var legend = elem.svg.selectAll(".legend")
                .data(twoGenesStyleArr)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                    return "translate(610, " + (30 + i * 15) + ")";
                })

            legend.append("path")
                .attr("width", 18)
                .attr("height", 18)
                .attr("d", d3.svg.symbol()
                    .size(30)
                    .type(function(d) { return "circle"; }))
                .attr("fill", function (d) { return d.fill; })
                .attr("stroke", function (d) { return d.stroke; })
                .attr("stroke-width", 1.1);

            legend.append("text")
                .attr("dx", ".75em")
                .attr("dy", ".35em")
                .style("text-anchor", "front")
                .text(function(d) {
                    if (d.text.indexOf("GeneX") !== -1) {
                        var tmp_legend = d.text.replace("GeneX", menu.geneX);
                    } else if (d.text.indexOf("GeneY") !== -1) {
                        var tmp_legend = d.text.replace("GeneY", menu.geneY);
                    } else {
                        var tmp_legend = d.text;
                    }
                    return tmp_legend;
                });
        } else {
            var legend = elem.svg.selectAll("g.legend").remove();
        }
    }

    function drawAxisTitle() {
        var elt_x = document.getElementById("custom_platform_x");
        var titleText_x = elt_x.options[elt_x.selectedIndex].text;
        var elt_y = document.getElementById("custom_platform_y");
        var titleText_y = elt_y.options[elt_y.selectedIndex].text;
        var xTitle =
            menu.geneX + ", " + titleText_x;
        var yTitle =
            menu.geneY + ", " + titleText_y;
        var axisTitleGroup = elem.svg.append("svg:g");
        axisTitleGroup.append("text")
            .attr("class", "label")
            .attr("x", 350)
            .attr("y", 580)
            .style("text-anchor", "middle")
            .style("font-weight","bold")
            .text(xTitle);
        axisTitleGroup.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -270)
            .attr("y", 45)
            .style("text-anchor", "middle")
            .style("font-weight","bold")
            .text(yTitle);
    }

    function addQtips() {
        elem.dotsGroup.selectAll('path').each(function(d) {
            $(this).qtip({
                content: {text: 'qtip failed'},
                events: {
                    render: function(event, api) {
                        var content = "<font size='2'>";
                        content += "Case ID: " + "<strong><a href='tumormap.do?case_id=" + d.case_id +
                            "&cancer_study_id=" + cancer_study_id + "'>" + d.case_id + "</a></strong><br>";
                        content += menu.geneX + ": <strong>" + parseFloat(d.x_value).toFixed(3) + "</strong><br>" +
                            menu.geneY + ": <strong>" + parseFloat(d.y_value).toFixed(3) + "</strong><br>";
                        if (d.annotation !== "") {
                            content += "Mutation: <strong>" + d.annotation + "</strong>";
                        }
                        content = content + "</font>";
                        api.set('content.text', content);
                    }
                },
                show: 'mouseover',
                hide: { fixed:true, delay: 100},
                style: { classes: 'ui-tooltip-light ui-tooltip-rounded ui-tooltip-shadow ui-tooltip-lightyellow' },
                position: {my:'left bottom',at:'top right'}
            });
        });
    }

    function drawImgConverter() {
        $('#custom_view_title').empty();
        $('#custom_view_title').append("Custom View : " + menu.geneX + " vs. " + menu.geneY);

        var pdfConverterForm =
            "<form style='display:inline-block' action='svgtopdf.do' method='post' " +
            "onsubmit=\"this.elements['svgelement'].value=loadSVG('plots_box_custom', 'pdf');\">" +
            "<input type='hidden' name='svgelement'>" +
            "<input type='hidden' name='filetype' value='pdf'>" +
            "<input type='hidden' name='filename' value='plots.pdf'>" +
            "<input type='submit' value='PDF'></form>";
        $('#custom_view_title').append(pdfConverterForm);

        var svgConverterForm =
            "<form style='display:inline-block' action='svgtopdf.do' method='post' " +
            "onsubmit=\"this.elements['svgelement'].value=loadSVG('plots_box_custom', 'svg');\">" +
            "<input type='hidden' name='svgelement'>" +
            "<input type='hidden' name='filetype' value='svg'>" +
            "<input type='hidden' name='filename' value='plots.svg'>" +
            "<input type='submit' value='SVG'></form>";
        $('#custom_view_title').append(svgConverterForm);
    }

    function drawErrorMsg() {
        $('#custom_view_title').empty();
        elem.svg.empty();

        elem.svg.append("text")
            .attr("x", 250)
            .attr("y", 55)
            .attr("text-anchor", "middle")
            .attr("fill", "#DF3A01")
            .text("There is no data available in")
        elem.svg.append("text")
            .attr("x", 250)
            .attr("y", 70)
            .attr("text-anchor", "middle")
            .attr("fill", "#DF3A01")
            .text("selected platform.")
        elem.svg.append("rect")
            .attr("x", 50)
            .attr("y", 30)
            .attr("width", 400)
            .attr("height", 50)
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", "#BDBDBD");

    }

    function updateMutationDisplay() {
        drawPlots();
        drawLegends();
        addQtips();
        drawImgConverter();
    }

    function getProfileDataCallBack(result) {
        pDataInit(result);
        initCanvas();
        if (pData.dotsData.length !== 0) {
            initAxis();
            drawAxis();
            drawPlots();
            drawLegends();
            drawAxisTitle();
            addQtips();
            drawImgConverter();
        } else {
            drawErrorMsg();
        }
    }

    return {
        init : function() {
            getUserSelection();
            //Contains a series of chained function
            //Including data fetching and drawing
            generatePlots();

        },
        update : function() {

        },
        updateMutationDisplay : updateMutationDisplay
    };
}());
