document.addEventListener("DOMContentLoaded", function () {
    const invoiceData = {
        companyName: "SmartRide",
        companyAddress: "123 Main Street, Hanoi, Vietnam",
        companyPhone: "+84 123 456 789",
        customerName: "Nguyen Van A",
        customerPhone: "+84 987 654 321",
        customerEmail: "nguyenvana@example.com",
        rideDetails: [
            { date: "2025-04-01", pickup: "Vincom Ba Trieu", dropoff: "Hoan Kiem Lake", distance: 5, price: 100000 },
            { date: "2025-04-02", pickup: "Indochina Plaza", dropoff: "West Lake", distance: 7, price: 150000 }
        ],
        taxRate: 0.1, // 10% VAT
        serviceFee: 20000 // Fixed service fee per ride
    };

    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    }

    function generateInvoice() {
        document.getElementById("company-name").textContent = invoiceData.companyName;
        document.getElementById("company-address").textContent = invoiceData.companyAddress;
        document.getElementById("company-phone").textContent = invoiceData.companyPhone;
        
        document.getElementById("customer-name").textContent = invoiceData.customerName;
        document.getElementById("customer-phone").textContent = invoiceData.customerPhone;
        document.getElementById("customer-email").textContent = invoiceData.customerEmail;
        
        let rideList = "";
        let subtotal = 0;
        invoiceData.rideDetails.forEach((ride, index) => {
            let total = ride.price + invoiceData.serviceFee;
            subtotal += total;
            rideList += `<tr>
                <td>${index + 1}</td>
                <td>${ride.date}</td>
                <td>${ride.pickup}</td>
                <td>${ride.dropoff}</td>
                <td>${ride.distance} km</td>
                <td>${formatCurrency(ride.price)}</td>
                <td>${formatCurrency(invoiceData.serviceFee)}</td>
                <td>${formatCurrency(total)}</td>
            </tr>`;
        });

        document.getElementById("ride-list").innerHTML = rideList;
        let taxAmount = subtotal * invoiceData.taxRate;
        let grandTotal = subtotal + taxAmount;

        document.getElementById("subtotal").textContent = formatCurrency(subtotal);
        document.getElementById("tax").textContent = formatCurrency(taxAmount);
        document.getElementById("grand-total").textContent = formatCurrency(grandTotal);
    }

    generateInvoice();

    document.getElementById("download-invoice").addEventListener("click", function () {
        window.print();
    });
});
