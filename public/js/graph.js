window.addEventListener("load", getData(genFunction));

//---------- First get data ---------------
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
  console.log(data)
  const label = [];
  const detail = [];
  for (let key in data) {
    label.push(key);
    detail.push(data[key].bends.count);
  }
  updateData(label, detail);
}

function updateData(label, detail) {
  let l = label.map(i => parseInt(i));
  let d = [...detail];
  for (let i = 0; i < l.length; i++) {
    if (i !== l.length - 1 && l[i + 1] - l[i] !== 1) {
      l.splice(i + 1, 0, l[i] + 1);
      d.splice(i + 1, 0, 0);
    }
  }

  chart.data.labels = l.map(i => i + ":00");
  chart.data.datasets[0].data = d;
  chart.update();
}

//--------- Graoh sketch ------------------
var ctx = document.getElementById("myChart");
var chart = new Chart(ctx, {
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
