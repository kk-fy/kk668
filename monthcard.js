// ========== 公共：localStorage 数据源 ==========
const STORAGE_KEY = "cardList";

// 初始化本地月卡数组（无数据时写入默认模拟数据）
function initCardData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    var mockData = [
      {id:1, carNo:"赣A12345", owner:"张三", phone:"13800138000", cardType:"月度", fee:300, startTime:"2026-07-01", endTime:"2026-10-01", status:"normal"},
      {id:2, carNo:"赣B67890", owner:"李四", phone:"13900139000", cardType:"季度", fee:800, startTime:"2026-06-01", endTime:"2026-08-01", status:"expire"},
      {id:3, carNo:"粤C24680", owner:"王五", phone:"13700137000", cardType:"月度", fee:300, startTime:"2026-08-01", endTime:"2026-11-01", status:"normal"},
      {id:4, carNo:"浙D13579", owner:"赵六", phone:"13600136000", cardType:"月度", fee:300, startTime:"2026-05-01", endTime:"2026-06-01", status:"expire"},
      {id:5, carNo:"苏E99999", owner:"孙七", phone:"13500135000", cardType:"季度", fee:800, startTime:"2026-07-15", endTime:"2026-12-15", status:"normal"},
      {id:6, carNo:"沪F88888", owner:"周八", phone:"13400134000", cardType:"月度", fee:300, startTime:"2026-09-01", endTime:"2026-10-01", status:"normal"}
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
}

// 获取月卡列表
function getCardList() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// 保存月卡列表到localStorage
function saveCardList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// 根据id获取单条月卡
function getCardById(id) {
  return getCardList().find(function(i) {
    return i.id === Number(id);
  });
}

// 计算剩余有效天数
function calcRemainDays(endStr) {
  var end = new Date(endStr);
  end.setHours(0, 0, 0, 0);
  var now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// 根据结束日期判断月卡状态
function getCardStatus(endStr) {
  return calcRemainDays(endStr) >= 0 ? "normal" : "expire";
}

// 状态文本转换
function statusText(s) {
  return s === "normal" ? "正常" : "已过期";
}

// ========== 首页渲染函数 ==========
function renderIndex() {
  var cardList = getCardList();
  document.getElementById('totalCard').innerText = cardList.length;
}

// ========== 月卡列表页：渲染函数（数据视图分离核心） ==========
var pageSize = 5;
var currentPage = 1;
var filterList = [];

function renderTable() {
  if (filterList.length === 0) {
    filterList = getCardList();
  }
  var total = filterList.length;
  var totalPage = Math.max(1, Math.ceil(total / pageSize));
  if (currentPage > totalPage) currentPage = totalPage;
  var start = (currentPage - 1) * pageSize;
  var pageData = filterList.slice(start, start + pageSize);

  var html = "";
  pageData.forEach(function(item) {
    html += '<tr>'
      + '<td><input type="checkbox" class="rowCheck" data-id="' + item.id + '"></td>'
      + '<td>' + item.carNo + '</td>'
      + '<td>' + item.owner + '</td>'
      + '<td>' + item.phone + '</td>'
      + '<td>' + item.cardType + '</td>'
      + '<td>' + item.fee + '</td>'
      + '<td>' + item.startTime + '</td>'
      + '<td>' + item.endTime + '</td>'
      + '<td>' + statusText(item.status) + '</td>'
      + '<td>'
      + '<button class="op-btn" onclick="location.href=\'addMonthCard.html?id=' + item.id + '\'">编辑</button>'
      + '<button class="op-btn del" onclick="singleDel(' + item.id + ')">删除</button>'
      + '</td></tr>';
  });
  document.getElementById('tableBody').innerHTML = html;

  // 渲染分页
  var pageHtml = "";
  for (var i = 1; i <= totalPage; i++) {
    pageHtml += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" onclick="goPage(' + i + ')">' + i + '</button>';
  }
  pageHtml += '<span style="margin-left:10px;font-size:12px;color:#999;">共 ' + total + ' 条</span>';
  document.getElementById('pageBox').innerHTML = pageHtml;
}

function goPage(p) {
  currentPage = p;
  renderTable();
}

// ========== 月卡列表页：查询筛选 ==========
function searchCard() {
  var carKw = document.getElementById('carNumber').value.trim().toLowerCase();
  var ownerKw = document.getElementById('ownerName').value.trim();
  var statusVal = document.getElementById('cardStatus').value;
  var all = getCardList();
  filterList = all.filter(function(i) {
    var matchCar = i.carNo.toLowerCase().indexOf(carKw) >= 0;
    var matchOwner = i.owner.indexOf(ownerKw) >= 0;
    var matchStatus = statusVal === "" || i.status === statusVal;
    return matchCar && matchOwner && matchStatus;
  });
  currentPage = 1;
  renderTable();
}

// 重置搜索
function resetSearch() {
  document.getElementById('carNumber').value = '';
  document.getElementById('ownerName').value = '';
  document.getElementById('cardStatus').value = '';
  filterList = getCardList();
  currentPage = 1;
  renderTable();
}

// ========== 月卡列表页：删除 ==========
function singleDel(id) {
  if (!confirm('确认删除该月卡？')) return;
  var list = getCardList().filter(function(i) {
    return i.id !== id;
  });
  saveCardList(list);
  filterList = list;
  renderTable();
}

function batchDel() {
  var ids = Array.prototype.map.call(document.querySelectorAll('.rowCheck:checked'), function(c) {
    return Number(c.dataset.id);
  });
  if (ids.length === 0) {
    alert('请先勾选要删除的月卡');
    return;
  }
  if (!confirm('确认删除选中的 ' + ids.length + ' 条记录？')) return;
  var list = getCardList().filter(function(i) {
    return ids.indexOf(i.id) < 0;
  });
  saveCardList(list);
  filterList = list;
  renderTable();
}

// ========== 新增/编辑月卡页 ==========
var regCar = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-HJ-NP-Z]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{5}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
var regPhone = /^1[3-9]\d{9}$/;

function getUrlParam(name) {
  var qs = location.search.substring(1).split('&');
  for (var i = 0; i < qs.length; i++) {
    var kv = qs[i].split('=');
    if (kv[0] === name) return decodeURIComponent(kv[1] || '');
  }
  return null;
}

var editId = null;

function initAddPage() {
  editId = getUrlParam('id');
  if (editId !== null && editId !== '') {
    var data = getCardById(editId);
    if (data) {
      document.getElementById('pageTitle').innerText = '编辑月卡';
      document.getElementById('carNo').value = data.carNo;
      document.getElementById('owner').value = data.owner;
      document.getElementById('phone').value = data.phone;
      document.getElementById('cardType').value = data.cardType;
      document.getElementById('fee').value = data.fee;
      document.getElementById('startTime').value = data.startTime;
      document.getElementById('endTime').value = data.endTime;
    }
  }
  refreshCalc();
  bindAddEvents();
}

function refreshCalc() {
  var end = document.getElementById('endTime').value;
  var info = document.getElementById('calcInfo');
  if (!end) {
    info.innerHTML = '剩余有效天数：— 天　|　月卡状态：—';
    return;
  }
  var days = calcRemainDays(end);
  var status = getCardStatus(end);
  info.innerHTML = '剩余有效天数：<b>' + days + '</b> 天　|　月卡状态：<b>' + statusText(status) + '</b>';
}

function bindAddEvents() {
  document.getElementById('endTime').addEventListener('change', refreshCalc);
  document.getElementById('startTime').addEventListener('change', function() {
    var s = this.value;
    var e = document.getElementById('endTime').value;
    if (s && e && e <= s) {
      document.getElementById('endTime').value = '';
    }
    refreshCalc();
  });
  document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('carNo').value = '';
    document.getElementById('owner').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('cardType').value = '';
    document.getElementById('fee').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    hideAllErr();
    refreshCalc();
  });
  document.getElementById('saveBtn').addEventListener('click', onSave);
}

function hideAllErr() {
  document.querySelectorAll('.form-item .err').forEach(function(e) {
    e.style.display = 'none';
  });
}

function showErr(id) {
  document.getElementById(id).style.display = 'block';
}

function validate() {
  hideAllErr();
  var ok = true;
  var carNo = document.getElementById('carNo').value.trim();
  var owner = document.getElementById('owner').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var cardType = document.getElementById('cardType').value.trim();
  var fee = document.getElementById('fee').value;
  var start = document.getElementById('startTime').value;
  var end = document.getElementById('endTime').value;

  if (!carNo || !regCar.test(carNo)) { showErr('errCar'); ok = false; }
  if (!owner) { showErr('errOwner'); ok = false; }
  if (!phone || !regPhone.test(phone)) { showErr('errPhone'); ok = false; }
  if (!cardType) { showErr('errType'); ok = false; }
  if (fee === '' || Number(fee) < 0 || isNaN(Number(fee))) { showErr('errFee'); ok = false; }
  if (!start) { showErr('errStart'); ok = false; }
  if (!end) { showErr('errEnd'); ok = false; }
  else if (start && end <= start) { showErr('errEnd'); ok = false; }
  return ok;
}

function onSave() {
  if (!validate()) return;
  var list = getCardList();
  var carNo = document.getElementById('carNo').value.trim();
  var owner = document.getElementById('owner').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var cardType = document.getElementById('cardType').value.trim();
  var fee = Number(document.getElementById('fee').value);
  var start = document.getElementById('startTime').value;
  var end = document.getElementById('endTime').value;
  var status = getCardStatus(end);

  if (editId !== null && editId !== '') {
    var idx = list.findIndex(function(i) { return i.id === Number(editId); });
    if (idx < 0) { alert('数据不存在'); return; }
    list[idx] = { id: Number(editId), carNo: carNo, owner: owner, phone: phone, cardType: cardType, fee: fee, startTime: start, endTime: end, status: status };
    saveCardList(list);
    alert('编辑保存成功');
  } else {
    var newId = list.length ? Math.max.apply(null, list.map(function(i) { return i.id; })) + 1 : 1;
    list.push({ id: newId, carNo: carNo, owner: owner, phone: phone, cardType: cardType, fee: fee, startTime: start, endTime: end, status: status });
    saveCardList(list);
    alert('新增保存成功');
  }
  location.href = 'monthCard.html';
}
