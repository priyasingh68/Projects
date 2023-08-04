let arr = [
    {name: "Harshit", marks: 20},
    {name: "Anupriya", marks: 40},
    {name: "Moin", marks: 70}
  ];
  
  arr.sort((a, b) => a.name.localeCompare(b.name));
  
  for (let i = 0; i < arr.length; i++) {
    arr[i].roll_no = i + 1;
  }
  
  let class_name = 10;
  for (let i = 0; i < arr.length; i++) {
    arr[i].class = class_name;
  }
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].marks < 40) {
      arr[i].remark = "FAILED";
    } else if (arr[i].marks == 40) {
      arr[i].remark = "RETEST";
    } else {
      arr[i].remark = "PASSED";
    }
  }
  
  console.log(arr);
  