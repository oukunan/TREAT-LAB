window.addEventListener("load", getData(genFunction));

const timeLabel = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23"
];

// //---------- First get data ---------------
function getData(cb) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let graphData = firebase
        .database()
        .ref(`users/${user.uid}/behavior/${date}`);
      graphData.on("value", snapshot => {
        cb(snapshot.val());
      });
    }
  });
}

function genFunction(data) {
  let sitLabel = [],
    relaxLabel = [],
    mouseLabel = [],
    bendLabel = [],
    keyboardLabel = [];

  const sitData = [],
    relaxData = [],
    mouseData = [],
    bendData = [],
    keyboardData = [];

  for (let key in data) {
    let timeKey = parseInt(key);
    if (data[key].hasOwnProperty("sit")) {
      sitLabel.push(timeKey);
      sitData.push(data[key].sit.duration);
    }
    if (data[key].hasOwnProperty("relax")) {
      relaxLabel.push(timeKey);
      relaxData.push(data[key].relax.duration);
    }
    if (data[key].hasOwnProperty("mouse")) {
      mouseLabel.push(timeKey);
      mouseData.push(data[key].mouse.mouseClickCount);
    }
    if (data[key].hasOwnProperty("bends")) {
      bendLabel.push(timeKey);
      bendData.push(data[key].bends.count);
    }
    if (data[key].hasOwnProperty("keyboard")) {
      keyboardLabel.push(timeKey);
      keyboardData.push(data[key].keyboard.keycount);
    }
  }

  const sitFinal = new Array(24);
  const relaxFinal = new Array(24);
  const mouseFinal = new Array(24);
  const bendFinal = new Array(24);
  const keyboardFinal = new Array(24);

  for (let i = 0; i < sitData.length; i++) {
    sitFinal.splice(sitLabel[i], 1, sitData[i]);
  }

  for (let i = 0; i < relaxData.length; i++) {
    relaxFinal.splice(relaxLabel[i], 1, relaxData[i]);
  }

  for (let i = 0; i < mouseData.length; i++) {
    mouseFinal.splice(mouseLabel[i], 1, mouseData[i]);
  }

  for (let i = 0; i < bendData.length; i++) {
    bendFinal.splice(bendLabel[i], 1, bendData[i]);
  }

  for (let i = 0; i < keyboardData.length; i++) {
    keyboardFinal.splice(keyboardLabel[i], 1, keyboardData[i]);
  }

  timeChart.data.datasets[0].data = sitFinal;
  timeChart.data.datasets[1].data = relaxFinal;
  timeChart.data.datasets[2].data = mouseFinal;

  chart.data.datasets[0].data = bendFinal;
  chart.data.datasets[1].data = keyboardFinal;

  timeChart.update();
  chart.update();
}

//--------- Graph sketch ------------------
let ctx = document.getElementById("timeChart");
let cty = document.getElementById("normalChart");

let timeChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: timeLabel,
    datasets: [
      {
        label: "Sit",
        fill: false,
        borderColor: "red",
        data: [],
        spanGaps: false
      },
      {
        label: "Relax",
        fill: false,
        borderColor: "green",
        data: [],
        spanGaps: false
      },
      {
        label: "Mouse",
        fill: false,
        borderColor: "orange",
        data: [],
        spanGaps: false
      }
    ]
  },
  options: {
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: true
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Time usage (seconds)"
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

let chart = new Chart(cty, {
  type: "line",
  data: {
    labels: timeLabel,
    datasets: [
      {
        label: "Bending",
        fill: false,
        borderColor: "red",
        data: [],
        spanGaps: false
      },
      {
        label: "Keyboard",
        fill: false,
        borderColor: "green",
        data: [],
        spanGaps: false
      }
    ]
  },
  options: {
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: true
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Counts"
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
