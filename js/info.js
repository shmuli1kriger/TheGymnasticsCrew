const classTimes = ['10:00 am', '11:05 am', '12:20 pm'];
const classEndTimes = ['11:05 am', '12:20 pm', '1:40 pm']
const classDates = ['2026-10-18', '2026-10-25', '2026-11-01', '2026-11-15', '2026-11-22', '2026-11-29', '2026-12-13', '2026-12-27', '2027-01-03', '2027-01-10', '2027-01-17', '2027-01-24'];
const numberOfClasses = 12;
const semesterStartDate = 'October 18th';
const semesterPrice = 400;
document.querySelectorAll('.semester').forEach(el => {
  el.innerText = 'Fall/Winter';
});
document.querySelectorAll('.classtime1').forEach(el => {
  el.innerText = classTimes[0];
});
document.querySelectorAll('.classtime2').forEach(el => {
  el.innerText = classTimes[1];
});
document.querySelectorAll('.classtime3').forEach(el => {
  el.innerText = classTimes[2];
});
document.querySelectorAll('.numberOfClasses').forEach(el => {
  el.innerText = numberOfClasses;
});
document.querySelectorAll('.startingDate').forEach(el => {
  el.innerText = semesterStartDate;
});
document.querySelectorAll('.semesterPrice').forEach(el => {
  el.innerText = semesterPrice;
});

