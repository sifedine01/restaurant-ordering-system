let Menu = { 
  tacos: [
    { name: 'Chicken Tacos', price: 8.50 },
    { name: 'Beef Tacos', price: 9.00 },
    { name: 'Fish Tacos', price: 10.50 }
  ],
  burger: [
    { name: 'Classic Burger', price: 12.00 },
    { name: 'Cheese Burger', price: 13.50 },
    { name: 'Deluxe Burger', price: 15.00 }
  ],
  pizza: [
    { name: 'Margherita Pizza', price: 14.00 },
    { name: 'Four Cheese Pizza', price: 16.50 },
    { name: 'Hawaiian Pizza', price: 17.00 }
  ],
  drinks: [
    { name: 'Coca Cola', price: 3.00 },
    { name: 'Fanta', price: 3.00 },
    { name: 'Water', price: 2.00 }
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  let sec1 = document.getElementById('sec1');
  let tables = document.querySelector('.tables');
  let choseBtn = document.querySelector('.chose');
  let sec2 = document.getElementById('sec2');
  let ordersContainer = document.getElementById('orders-container');
  let menuContainer = document.querySelector('.menu-items');
  let backBtn = document.querySelector('.back');
  let discountApplied = false;
  let selectedPaymentMethod = '';
  let selectedTable = '';

  // Mini summary setup
  let miniSummary = document.createElement('div');
  miniSummary.style.position = 'fixed';
  miniSummary.style.border = '2px solid #d4af37';
  miniSummary.style.top = '92px';
  miniSummary.style.right = '50px';
  miniSummary.style.backgroundColor = '#1c1c1c';
  miniSummary.style.color = 'gold';
  miniSummary.style.padding = '10px';
  miniSummary.style.borderRadius = '20px';
  miniSummary.style.fontSize = '14px';
  miniSummary.style.textAlign = 'center';
  miniSummary.style.width = '20%';
  miniSummary.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  miniSummary.innerHTML = `items: 0 Reduction: 0%`;
  document.body.appendChild(miniSummary);

  backBtn.style.display = 'none';
  disableValidate();
  goToSec1();

  function goToSec1() {
    sec1.style.display = 'block';
    tables.style.display = 'flex';
    choseBtn.style.display = 'block';
    sec2.style.display = 'none';
    backBtn.style.display = 'none';
    miniSummary.style.display = 'none';
  }

  function goToSec2() {
    sec1.style.display = 'none';
    tables.style.display = 'none';
    choseBtn.style.display = 'none';
    sec2.style.display = 'flex';
    backBtn.style.display = 'flex';
    miniSummary.style.display = 'block';
  }

  document.querySelectorAll('#sec1 td').forEach(td => {
    td.dataset.reserved = "false";
    td.addEventListener('click', function() {
      if (td.dataset.reserved === "true") return;
      document.querySelectorAll('#sec1 td').forEach(t => {
        t.style.outline = '';
        t.style.backgroundColor = t.dataset.reserved === "true" ? 'green' : '';
        t.style.color = t.dataset.reserved === "true" ? 'white' : '';
      });
      this.style.outline = '2px solid #ff6347';
      this.style.backgroundColor = '#ffe9e3';
      this.style.color = '#111';
      selectedTable = td.textContent.replace('(Reserved)', '').trim();

      // Reset totals when selecting new table
      ordersContainer.innerHTML = '';
      discountApplied = false;
      selectedPaymentMethod = '';
      document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('total').textContent = '0.00 MAD';
      document.getElementById('to-pay').textContent = '0.00 MAD';
      miniSummary.innerHTML = `items: 0 Reduction: 0%`;

      goToSec2();
    });

    td.addEventListener('mouseenter', function() {
      td.title = td.dataset.reserved === "true" ? 'Reserved' : 'Available';
    });
  });

  backBtn.addEventListener('click', function() {
    goToSec1();
  });

  // Render menu
  function render(category) {
    menuContainer.innerHTML = '';
    let items = Menu[category] || [];
    items.forEach(item => {
      let row = document.createElement('div');
      row.className = 'menu-item';

      let nameSpan = document.createElement('span');
      nameSpan.className = 'item-name';
      nameSpan.textContent = item.name;

      let actionsDiv = document.createElement('div');
      actionsDiv.className = 'item-actions';

      let priceSpan = document.createElement('span');
      priceSpan.className = 'item-price';
      priceSpan.textContent = item.price.toFixed(2) + ' MAD';

      let addBtn = document.createElement('button');
      addBtn.className = 'add-btn';
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      addBtn.addEventListener('click', function() {
        addToOrder(item.name, item.price.toFixed(2));
      });

      actionsDiv.appendChild(priceSpan);
      actionsDiv.appendChild(addBtn);
      row.appendChild(nameSpan);
      row.appendChild(actionsDiv);
      menuContainer.appendChild(row);
    });
  }

  render('tacos');

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      render(this.getAttribute('data-category'));
    });
  });

  function addToOrder(name, price) {
    let orderItem = document.createElement('div');
    orderItem.className = 'order-item';

    let nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = name;

    let rightDiv = document.createElement('div');
    rightDiv.className = 'right-actions';

    let priceSpan = document.createElement('span');
    priceSpan.className = 'item-price';
    priceSpan.textContent = parseFloat(price).toFixed(2) + ' MAD';

    let removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    removeBtn.addEventListener('click', () => { 
      orderItem.remove(); 
      updateTotals();
    });

    rightDiv.appendChild(priceSpan);
    rightDiv.appendChild(removeBtn);
    orderItem.appendChild(nameSpan);
    orderItem.appendChild(rightDiv);
    ordersContainer.appendChild(orderItem);
    updateTotals();
  }

  function updateTotals() {
    let items = ordersContainer.querySelectorAll('.order-item .item-price');
    let total = 0;
    items.forEach(span => total += parseFloat(span.textContent.replace(' MAD','')));

    let discountPercent = 0;
    if (items.length >= 4) discountPercent = 10;
    else if (items.length >= 2) discountPercent = 5;

    let toPay = total * (1 - discountPercent / 100);

    document.getElementById('total').textContent = total.toFixed(2) + ' MAD';
    document.getElementById('to-pay').textContent = toPay.toFixed(2) + ' MAD';
    miniSummary.innerHTML = `items: ${items.length} Reduction: ${discountPercent}%`;
  }

  document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedPaymentMethod = this.getAttribute('data-method');
      enableValidate();
    });
  });

  function disableValidate() {
    document.getElementById('valider-btn').disabled = true;
    document.getElementById('valider-btn').style.opacity = '0.5';
  }

  function enableValidate() {
    document.getElementById('valider-btn').disabled = false;
    document.getElementById('valider-btn').style.opacity = '1';
  }

  document.getElementById('valider-btn').addEventListener('click', function() {
    if (!selectedTable) return alert('Select a table before validating.');
    if (!ordersContainer.children.length) return alert('Add items before validating.');
    if (!selectedPaymentMethod) return alert('Select a payment method before validating.');

    let itemsText = [];
    ordersContainer.querySelectorAll('.order-item').forEach(item => {
      itemsText.push(item.querySelector('.item-name').textContent + ' - ' + item.querySelector('.item-price').textContent);
    });
    let orderSummaryText = itemsText.join('\n');

    let total = document.getElementById('total').textContent;
    let toPay = document.getElementById('to-pay').textContent;

    let selectedTd = Array.from(document.querySelectorAll('#sec1 td'))
                      .find(td => td.textContent.includes(selectedTable) && td.style.outline);

    if (selectedTd) {
      selectedTd.style.backgroundColor = 'green';
      selectedTd.style.color = 'white';
      selectedTd.dataset.reserved = "true";
      selectedTd.dataset.orderSummary = orderSummaryText;
      selectedTd.innerHTML = selectedTable + ' (Reserved) <br>';

      // Local copies for event listeners
      const tableForBtn = selectedTable;
      const orderForBtn = orderSummaryText;
      const paymentForBtn = selectedPaymentMethod;

      // Cancel button
      let cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.marginTop = '5px';
      cancelBtn.style.backgroundColor = '#ff7a45';
      cancelBtn.style.color = '#fff';
      cancelBtn.style.border = 'none';
      cancelBtn.style.padding = '5px';
      cancelBtn.style.borderRadius = '6px';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.addEventListener('click', function(e){
        e.stopPropagation();
        selectedTd.style.backgroundColor = '';
        selectedTd.style.color = '';
        selectedTd.dataset.reserved = "false";
        selectedTd.dataset.orderSummary = '';
        selectedTd.textContent = tableForBtn;
      });
      selectedTd.appendChild(cancelBtn);

      // Show order
      let showBtn = document.createElement('button');
      showBtn.textContent = 'Show';
      showBtn.style.marginTop = '5px';
      showBtn.style.marginLeft = '5px';
      showBtn.style.backgroundColor = '#d4af37';
      showBtn.style.color = '#111';
      showBtn.style.border = 'none';
      showBtn.style.padding = '5px';
      showBtn.style.borderRadius = '6px';
      showBtn.style.cursor = 'pointer';
      showBtn.addEventListener('click', function(e){
        e.stopPropagation();
        alert('Order for ' + tableForBtn + ':\n\n' + orderForBtn);
      });
      selectedTd.appendChild(showBtn);

      // Take edition
      let editionBtn = document.createElement('button');
      editionBtn.textContent = 'Take Recu';
      editionBtn.style.marginTop = '5px';
      editionBtn.style.marginLeft = '5px';
      editionBtn.style.backgroundColor = '#1e90ff';
      editionBtn.style.color = '#fff';
      editionBtn.style.border = 'none';
      editionBtn.style.padding = '5px';
      editionBtn.style.borderRadius = '6px';
      editionBtn.style.cursor = 'pointer';
      editionBtn.addEventListener('click', function(e){
        e.stopPropagation();

        let printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write('<html><head><title>Order - ' + tableForBtn + '</title></head><body>');
        printWindow.document.write('<h2>Kaser Diafa - Order</h2>');
        printWindow.document.write('<p><strong>Table:</strong> ' + tableForBtn + '</p>');
        printWindow.document.write('<p><strong>Payment Method:</strong> ' + paymentForBtn + '</p>');
        printWindow.document.write('<h3>Items:</h3><ul>');
        orderForBtn.split('\n').forEach(i => printWindow.document.write('<li>' + i + '</li>'));
        printWindow.document.write('</ul>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();

        // Reset table
        selectedTd.style.backgroundColor = '';
        selectedTd.style.color = '';
        selectedTd.dataset.reserved = "false";
        selectedTd.dataset.orderSummary = '';
        selectedTd.textContent = tableForBtn;
      });
      selectedTd.appendChild(editionBtn);
    }

    // Reset order for new selection
    ordersContainer.innerHTML = '';
    discountApplied = false;
    selectedPaymentMethod = '';
    document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
    disableValidate();
    miniSummary.innerHTML = `Food: 0<br>Reduction: 0%`;
    goToSec1();
  });
});
