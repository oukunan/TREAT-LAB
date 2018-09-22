window.addEventListener("load", getData(genFunction));

// //---------- First get data ---------------
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
  let sitLabel = [],
    relaxLabel = [],
    mouseLabel = [];
  const label = [],
    sitData = [],
    relaxData = [],
    mouseData = [];

  for (let key in data) {
    let timeKey = parseInt(key);

    sitLabel.push(timeKey);
    sitData.push(data[key].sit.duration);

    relaxLabel.push(timeKey);
    relaxData.push(data[key].relax.duration);

    mouseLabel.push(timeKey);
    mouseData.push(data[key].mouse.mouseClickCount);
  }

  const sitFinal = new Array(24);
  const relaxFinal = new Array(24);
  const mouseFinal = new Array(24);

  for (let i = 0; i < sitData.length; i++) {
    sitFinal.splice(sitLabel[i], 1, sitData[i]);
  }

  for (let i = 0; i < relaxData.length; i++) {
    relaxFinal.splice(relaxLabel[i], 1, relaxData[i]);
  }

  for (let i = 0; i < mouseData.length; i++) {
    mouseFinal.splice(mouseLabel[i], 1, mouseData[i]);
  }

  timeChart.data.datasets[0].data = sitFinal;
  timeChart.data.datasets[1].data = relaxFinal;
  timeChart.data.datasets[2].data = mouseFinal;

  timeChart.update();
}

//--------- Graph sketch ------------------
let ctx = document.getElementById("timeChart");
let timeChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
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
    ],
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
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});
