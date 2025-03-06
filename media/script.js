console.log('Chart.js loaded:', typeof Chart);

window.addEventListener("message", (event) => {
    const conditions = event.data.conditions || [];

    // Check if conditions are being received correctly
    console.log("Received conditions:", conditions);

    const list = document.getElementById("conditions-list");
    list.innerHTML = conditions.map(cond => `<li>${cond}</li>`).join('');

    // Create a frequency count of conditions
    const conditionCounts = conditions.reduce((acc, cond) => {
        acc[cond] = (acc[cond] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(conditionCounts);
    const data = Object.values(conditionCounts);

    // Check if labels and data are populated correctly
    console.log("Labels:", labels);
    console.log("Data:", data);

    // Ensure DOM is fully ready and canvas is available before rendering the chart
    const ctx = document.getElementById('ifConditionsChart')?.getContext('2d');

    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'If Conditions Frequency',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        console.error("Canvas element not found or unable to get context");
    }
});
