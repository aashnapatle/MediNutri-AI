function calculateBMI() {
  let height = document.getElementById("height").value;
  let weight = document.getElementById("weight").value;

  height = height / 100;
  let bmi = weight / (height * height);

  let result = "Your BMI is: " + bmi.toFixed(2);

  if (bmi < 18.5) {
    result += " (Underweight)";
  } else if (bmi < 25) {
    result += " (Normal)";
  } else {
    result += " (Overweight)";
  }

  document.getElementById("result").innerText = result;
}