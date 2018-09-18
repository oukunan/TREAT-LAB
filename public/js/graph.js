window.addEventListener("load", getData(genFunction));

//---------- First get data ---------------
let bendGraphData = [], sitGraphData = [], relaxGraphData = [], keyboardGraphData = [], mouseGraphData = [];
let graphDataRef;
function getData(cb) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let bendGraphRef = firebase
        .database()
        .ref(`users/${user.uid}/behavior/${date}`);
      bendGraphRef.on("value", snapshot => {
        cb(snapshot.val());
      });
    }
  });
}

function genFunction(data) {
  const label = [];
  const detail = [];
  for (let key in data) {
    label.push(key);
    detail.push(data[key].bends.count);
    bendGraphData = [label, detail];
    updateData(bendGraphData, 1);

    detail.push(data[key].mouse.mouseClickCount);
    mouseGraphData = [label, detail];
    updateData(mouseGraphData, 2);

    detail.push(data[key].relax.duration);
    relaxGraphData = [label, detail];
    updateData(relaxGraphData, 3);

    detail.push(data[key].sit.duration);
    sitGraphData = [label, detail];
    updateData(sitGraphData, 4);

    detail.push(data[key].keyboard.keyboardcount);
    keyboardGraphData = [label, detail];
    updateData(keyboardGraphData, 5);

  }
}

function updateData(arrays, num) {
  label = arrays[0];
  detail = arrays[1];
  let l = label.map(i => parseInt(i));
  let d = [...detail];
  for (let i = 0; i < l.length; i++) {
    if (i !== l.length - 1 && l[i + 1] - l[i] !== 1) {
      l.splice(i + 1, 0, l[i] + 1);
      d.splice(i + 1, 0, 0);
    }
  }

  console.log("ready")
  if (num == 1) {
    console.log("in");
    var bendElement = document.getElementById("bendgraph");
    console.log("in1");
    let bendChart = createChart(bendElement);
    console.log("in2");
    bendChart.data.labels = l.map(i => i + ":00");
    console.log("in3");
    bendChart.data.datasets[0].data = d;
    console.log("in4");
    bendChart.update();
  }

  if (num == 2) {
    var mouseElement = document.getElementById("mousegraph");
    let mouseChart = createChart(mouseElement);
    mouseChart.data.labels = l.map(i => i + ":00");
    mouseChart.data.datasets[0].data = d;
    mouseChart.update();
  }

  if (num == 3) {
    var relaxElement = document.getElementById("relaxgraph");
    let relaxChart = createChart(relaxElement);
    relaxChart.data.labels = l.map(i => i + ":00");
    relaxChart.data.datasets[0].data = d;
    relaxChart.update();
  }

  if (num == 4) {
    var sitElement = document.getElementById("sitgraph");
    let sitChart = createChart(sitElement);
    sitChart.data.labels = l.map(i => i + ":00");
    sitChart.data.datasets[0].data = d;
    sitChart.update();
  }

  if (num == 5) {
    var keyboardElement = document.getElementById("keyboardgraph");
    let keyboardChart = createChart(keyboardElement);
    keyboardChart.data.labels = l.map(i => i + ":00");
    keyboardChart.data.datasets[0].data = d;
    keyboardChart.update();
  }


}
//--------- Graoh sketch ------------------

function createChart(ele) {
  console.log("in11");
  var chart;
  console.log("in12");
  return chart = new Chart(ele, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Bending count",
          data: [],
          fill: false,
          borderColor: ["rgba(255,99,132,1)"],
          borderWidth: 4
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              suggestedMax: 10
            },
            scaleLabel: {
              display: true,
              labelString: "Number of bending"
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Hour"
            }
          }
        ]
      }
    }
  });
}
