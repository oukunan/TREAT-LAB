let label = [];
let detail = [];

window.addEventListener("load", getData(genFunction));

function getData(cb) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let bendGraphRef = firebase
        .database()
        .ref(`users/${user.uid}/bends/${date}`);
      bendGraphRef.on("value", snapshot => {
        cb(snapshot.val());
      });
    }
  });
}
function genFunction(data) {
  label = [];
  detail = [];
  for (let key in data) {
    label.push(key);
    detail.push(data[key].count);
  }

  var ctx = document.getElementById("myChart");
  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: label,
      datasets: [
        {
          label: "Bending count",
          data: detail,
          fill: false,
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
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

  chart.update();
}
