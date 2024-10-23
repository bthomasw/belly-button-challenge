// Build the metadata panel
function buildMetadata(sample) {
  //console.log("Trying something");
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let person = metadata.filter(d => d.id === +sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(person).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let person = samples.filter(d => d.id === sample)[0];
    console.log(person);

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = person.otu_ids;
    const otu_labels = person.otu_labels;
    const sample_values = person.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    let dataBubble = [bubbleTrace];

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title: 'OTU ID' },  
      yaxis: { title: 'Number of Bacteria' },  
    };

    

    // Render the Bubble Chart
    Plotly.newPlot('bubble', dataBubble, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let barData = [barTrace]

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
          title: 'Number of Bacteria'
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option")
              .text(name)           
              .attr("value", name); 
    });


    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
