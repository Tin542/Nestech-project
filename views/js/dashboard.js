(function renderChart() {
  $.ajax({
    type: "GET",
    url: `/admin/dashboard/chart`,
    success: function (rs) {
      let data = rs.data;
      console.log("rs", rs);
      const ctx = document.getElementById("myChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((el) => el.time),
          datasets: [
            {
              label: "# of Votes",
              data: data.map((el) => el.totalPriceOrder),
              borderWidth: 1,
            },
          ],
        },
      });
    },
  });
})();
