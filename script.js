function calculateBMI() {
  let height = document.getElementById("height").value;
  let weight = document.getElementById("weight").value;

  height = height / 100;
  let bmi = weight / (height * height);

  document.getElementById("result").innerText =
    "Your BMI is: " + bmi.toFixed(2);
}