
const http = require('http');
const VERSION = '2.0';

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Andina Market | Productos que nos conectan</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;color:#26352d;background:#fafaf7}
header{background:#173d2b;color:white;padding:17px 7%;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.logo{font-size:25px;font-weight:800;letter-spacing:.5px}
.logo span{color:#e9bd63}
nav{display:flex;gap:22px;align-items:center}
nav a{color:white;text-decoration:none;font-size:14px}
.cart{background:#e9bd63;color:#173d2b;border:0;padding:11px 16px;border-radius:25px;font-weight:bold;cursor:pointer}
.hero{background:linear-gradient(90deg,rgba(15,48,32,.92),rgba(15,48,32,.42)),url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600') center/cover;color:white;padding:90px 8%;min-height:370px;display:flex;align-items:center}
.hero-content{max-width:600px}
.hero small{color:#f2ce83;font-weight:bold;letter-spacing:3px}
.hero h1{font-size:clamp(38px,6vw,62px);margin:17px 0;line-height:1.08}
.hero p{font-size:17px;line-height:1.7;color:#edf2ed}
.cta{display:inline-block;margin-top:25px;background:#e9bd63;color:#173d2b;text-decoration:none;padding:14px 23px;border-radius:30px;font-weight:bold}
section{padding:55px 7%}
.section-title{text-align:center;margin-bottom:30px}
.section-title small{color:#a87932;font-weight:bold;letter-spacing:2px}
.section-title h2{font-size:32px;margin-top:9px;color:#173d2b}
.categories{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:30px}
.categories button{border:1px solid #d7dfd6;background:white;padding:10px 18px;border-radius:25px;cursor:pointer;color:#31523d}
.categories button.active,.categories button:hover{background:#173d2b;color:white}
.search{display:block;width:min(100%,430px);margin:0 auto 30px;padding:14px 18px;border:1px solid #d7dfd6;border-radius:25px;font-size:15px;outline-color:#497c56}
.products{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:23px}
.product{background:white;border-radius:15px;overflow:hidden;box-shadow:0 5px 22px #183d2b12;transition:.2s}
.product:hover{transform:translateY(-5px)}
.product img{width:100%;height:190px;object-fit:cover;background:#e9eee7}
.product-info{padding:18px}
.tag{font-size:11px;color:#a87932;font-weight:bold;text-transform:uppercase;letter-spacing:1px}
.product h3{margin:9px 0;color:#173d2b;font-size:18px}
.product p{font-size:13px;color:#758078;line-height:1.5;min-height:38px}
.price{font-size:21px;font-weight:bold;margin:14px 0;color:#173d2b}
.add{width:100%;border:0;border-radius:8px;padding:12px;background:#173d2b;color:white;font-weight:bold;cursor:pointer}
.add:hover{background:#2c6241}
.empty{text-align:center;grid-column:1/-1;padding:30px;color:#758078}
.about{background:#edf2e9;display:grid;grid-template-columns:1fr 1fr;gap:35px;align-items:center}
.about img{width:100%;height:300px;object-fit:cover;border-radius:15px}
.about h2{font-size:32px;color:#173d2b;margin-bottom:15px}
.about p{line-height:1.8;color:#58675c}
.benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:center}
.benefit{padding:20px}
.benefit .emoji{font-size:32px}
.benefit h3{margin:12px 0;color:#173d2b}
.benefit p{color:#758078;font-size:14px;line-height:1.6}
footer{background:#173d2b;color:#dce8dc;padding:35px 7%;text-align:center;line-height:1.9}
footer strong{color:#e9bd63}
#toast{position:fixed;bottom:20px;right:20px;background:#173d2b;color:white;padding:14px 20px;border-radius:10px;display:none;z-index:5}
@media(max-width:650px){header{justify-content:center}nav{order:3;width:100%;justify-content:center}.hero{padding:65px 7%}.about{grid-template-columns:1fr}.benefits{grid-template-columns:1fr}.section-title h2{font-size:27px}}
</style>
</head>
<body>
<header>
 <div class="logo">ANDINA <span>MARKET</span></div>
 <nav><a href="#inicio">Inicio</a><a href="#productos">Productos</a><a href="#nosotros">Nosotros</a></nav>
 <button class="cart" onclick="checkout()">🛒 Mi pedido (<span id="count">0</span>)</button>
</header>

<div class="hero" id="inicio">
 <div class="hero-content">
  <small>CALIDAD QUE VIENE DE NUESTRA TIERRA</small>
  <h1>Lo mejor de los Andes, cerca de ti.</h1>
  <p>Descubre productos seleccionados con tradición, calidad y el auténtico sabor del Perú.</p>
  <a class="cta" href="#productos">Explorar productos →</a>
 </div>
</div>

<section id="productos">
 <div class="section-title"><small>NUESTRO CATÁLOGO</small><h2>Descubre nuestros productos</h2></div>
 <input class="search" id="search" placeholder="🔎 Buscar un producto..." oninput="renderProducts()">
 <div class="categories">
  <button class="active" onclick="setCategory('Todos',this)">Todos</button>
  <button onclick="setCategory('Alimentos',this)">Alimentos</button>
  <button onclick="setCategory('Bebidas',this)">Bebidas</button>
  <button onclick="setCategory('Naturales',this)">Naturales</button>
 </div>
 <div class="products" id="products"></div>
</section>

<section class="about" id="nosotros">
 <img src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900" alt="Naturaleza andina">
 <div><small style="color:#a87932;font-weight:bold;letter-spacing:2px">SOMOS ANDINA MARKET</small>
 <h2>Tradición, calidad y confianza.</h2>
 <p>En Andina Market queremos acercarte a productos que representan lo mejor de nuestra tierra. Trabajamos para ofrecerte una experiencia de compra sencilla, cercana y confiable.</p>
 <a class="cta" href="#productos">Ver catálogo</a></div>
</section>

<section>
 <div class="section-title"><small>¿POR QUÉ ELEGIRNOS?</small><h2>Una compra sencilla y segura</h2></div>
 <div class="benefits">
  <div class="benefit"><div class="emoji">🌱</div><h3>Calidad seleccionada</h3><p>Productos elegidos pensando en nuestros clientes.</p></div>
  <div class="benefit"><div class="emoji">🚚</div><h3>Atención cercana</h3><p>Coordina tu pedido directamente con nuestro equipo.</p></div>
  <div class="benefit"><div class="emoji">💚</div><h3>Orgullo peruano</h3><p>Una propuesta inspirada en la riqueza de nuestra tierra.</p></div>
 </div>
</section>

<footer>
 <div class="logo">ANDINA <span>MARKET</span></div>
 <p>Productos que nos conectan con lo nuestro.</p>
 <p>© 2026 Andina Market. Todos los derechos reservados.</p>
 <small>Versión ${VERSION}</small>
</footer>
<div id="toast"></div>

<script>
const products = [
 {name:'Quinua Andina',category:'Alimentos',price:18,image:'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600',description:'Quinua seleccionada, ideal para tus comidas.'},
 {name:'Miel Natural',category:'Naturales',price:25,image:'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600',description:'Dulzura natural para acompañar tus días.'},
 {name:'Café Peruano',category:'Bebidas',price:28,image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600',description:'Aroma y sabor para disfrutar cada mañana.'},
 {name:'Chocolate Artesanal',category:'Alimentos',price:15,image:'https://images.unsplash.com/photo-1548907040-4d42f2b9f5a2?w=600',description:'Un delicioso antojo para cualquier momento.'},
 {name:'Frutos Secos',category:'Naturales',price:20,image:'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600',description:'Una opción práctica para tus meriendas.'},
 {name:'Infusión Andina',category:'Bebidas',price:12,image:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',description:'Una bebida reconfortante para compartir.'}
];
let category='Todos';
let cart=[];
function renderProducts(){
 const term=document.getElementById('search').value.toLowerCase();
 const filtered=products.filter(p=>(category==='Todos'||p.category===category)&&p.name.toLowerCase().includes(term));
 const container=document.getElementById('products');
 if(!filtered.length){container.innerHTML='<div class="empty">No encontramos productos con esa búsqueda.</div>';return;}
 container.innerHTML=filtered.map(p=>'<article class="product"><img src="'+p.image+'" alt="'+p.name+'"><div class="product-info"><span class="tag">'+p.category+'</span><h3>'+p.name+'</h3><p>'+p.description+'</p><div class="price">S/ '+p.price.toFixed(2)+'</div><button class="add" onclick="addToCart(\\''+p.name+'\\')">Agregar al pedido +</button></div></article>').join('');
}
function setCategory(value,button){
 category=value;
 document.querySelectorAll('.categories button').forEach(b=>b.classList.remove('active'));
 button.classList.add('active');
 renderProducts();
}
function addToCart(name){
 const item=products.find(p=>p.name===name);
 cart.push(item);
 document.getElementById('count').textContent=cart.length;
 const toast=document.getElementById('toast');
 toast.textContent='¡'+name+' agregado a tu pedido!';
 toast.style.display='block';
 setTimeout(()=>toast.style.display='none',2200);
}
function checkout(){
 if(!cart.length){alert('Tu pedido está vacío. Agrega algún producto primero.');return;}
 let message='Hola, Andina Market. Quiero realizar este pedido:%0A';
 let total=0;
 cart.forEach(p=>{message+='%E2%80%A2 '+encodeURIComponent(p.name)+' - S/ '+p.price.toFixed(2)+'%0A';total+=p.price;});
 message+='%0ATotal: S/ '+total.toFixed(2);
 // Reemplaza este número por el WhatsApp de tu empresa, con código de país.
 window.open('https://wa.me/51999999999?text='+message,'_blank');
}
renderProducts();
</script>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(3000);
