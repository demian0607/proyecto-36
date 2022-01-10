var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//crea aquí las variables feed y lastFed 
var feed,lastFed


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //crea aquí el boton Alimentar al perro
  alimentar = createButton("Alimentar al perro");
  alimentar.position(700,95);
  alimentar.mousePressed(feedDog);
  

  addFood=createButton("Agregar Alimento");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //escribe el código para leer el valor de tiempo de alimentación de la base de datos
  feedTime = database.ref("feedTime");
  feedTime.on("value",function (data){
    lastFed = data.val();
  })
 
  //escribe el código para mostrar el texto lastFed time aquí
  fill(255,255,254)
  textsize(15)
  if(lastFed >= 12){
    text("ultima hora que se alimento: "+lastFed%12+ "pm",350,30);
  }else if(lastFed == 0 ){
    text("ultima hora que se alimento: 12 am",350,30)
  }else{
    text("ultima hora que se alimento: "+lastFed+ "pm",350,30);
  }

 
  drawSprites();
}

//función para leer la Existencia de alimento
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock() <= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else {
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  }

  //escribe el código aquí para actualizar las existencia de alimento, y la última vez que se alimentó al perro
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    feedTime: hour()
  })
}

//funcón para agregar alimento al almacén
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
