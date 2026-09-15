"use client";
import {useEffect,useMemo,useState} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||"https://placeholder.supabase.co",process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"placeholder");
const demo=[
{id:"d1",name:"Premium Oversized T-Shirt",price:899,old_price:1199,stock:20,category:"Men",image_url:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900"},
{id:"d2",name:"Classic Casual Shirt",price:1299,old_price:1699,stock:14,category:"Men",image_url:"https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=900"},
{id:"d3",name:"Women's Oversized Tee",price:949,old_price:1299,stock:16,category:"Women",image_url:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900"},
{id:"d4",name:"Kids Cotton T-Shirt",price:599,old_price:799,stock:25,category:"Kids",image_url:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900"},
{id:"d5",name:"Premium Hoodie",price:1799,old_price:2299,stock:12,category:"Men",image_url:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900"},
{id:"d6",name:"Women's Casual Dress",price:1599,old_price:1999,stock:10,category:"Women",image_url:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900"}];
export default function Page(){
const [products,setProducts]=useState(demo),[cat,setCat]=useState("All"),[q,setQ]=useState(""),[cart,setCart]=useState([]),[open,setOpen]=useState(false),[msg,setMsg]=useState("");
const [form,setForm]=useState({name:"",phone:"",address:"",city:"",payment:"cod",size:"M",color:"Black"});
useEffect(()=>{try{const x=localStorage.getItem("km-cart");if(x)setCart(JSON.parse(x))}catch{};load()},[]);
async function load(){try{const {data}=await sb.from("products").select("*").eq("active",true).order("created_at",{ascending:false});if(data?.length)setProducts(data)}catch{}}
function save(c){setCart(c);localStorage.setItem("km-cart",JSON.stringify(c))}
function add(p){let c=[...cart],i=c.findIndex(x=>x.id===p.id&&x.size===form.size&&x.color===form.color);if(i>=0)c[i].qty=Math.min(c[i].qty+1,p.stock);else c.push({...p,qty:1,size:form.size,color:form.color});save(c);setMsg("Added to cart")}
function del(i){let c=cart.filter((_,n)=>n!==i);save(c)}
const shown=products.filter(p=>(cat==="All"||p.category===cat)&&(p.name||"").toLowerCase().includes(q.toLowerCase()));
const total=cart.reduce((s,x)=>s+x.price*x.qty,0),count=cart.reduce((s,x)=>s+x.qty,0);
async function order(e){e.preventDefault();if(!cart.length)return;
const {data,error}=await sb.from("orders").insert({customer_name:form.name,phone:form.phone,address:form.address,city:form.city,total,payment_method:form.payment,payment_status:"pending",order_status:"pending"}).select().single();
if(error){setMsg("Order database setup karo (README me steps hain).");return}
await sb.from("order_items").insert(cart.map(x=>({order_id:data.id,product_id:typeof x.id==="number"?x.id:null,product_name:x.name,price:x.price,quantity:x.qty,size:x.size,color:x.color})));
save([]);setOpen(false);setMsg("Order #"+data.id+" placed successfully!");}
return <main>
<header><div className="logo">🛍️ Khudra Market</div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search clothes..."/><button onClick={()=>setOpen(true)}>🛒 {count} · Rs. {total}</button></header>
<section className="hero"><div><small>NEW CLOTHING COLLECTION</small><h1>Style that feels like you.</h1><p>Trendy everyday fashion with simple prices.</p><a href="#shop">Shop Now</a></div></section>
<nav>{["All","Men","Women","Kids"].map(x=><button className={cat===x?"sel":""} onClick={()=>setCat(x)} key={x}>{x}</button>)}</nav>
<section id="shop" className="section"><div className="title"><div><small>SHOP</small><h2>Trending Clothes</h2></div><span>{shown.length} products</span></div><div className="grid">{shown.map(p=><article className="card" key={p.id}><div className="pic"><img src={p.image_url} alt={p.name}/>{p.old_price&&<b>SALE</b>}</div><div className="body"><small>{p.category}</small><h3>{p.name}</h3><strong>Rs. {p.price}</strong>{p.old_price&&<del>Rs. {p.old_price}</del>}<div className="choices"><select value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>{["S","M","L","XL","XXL"].map(x=><option key={x}>{x}</option>)}</select><select value={form.color} onChange={e=>setForm({...form,color:e.target.value})}>{["Black","White","Blue","Red"].map(x=><option key={x}>{x}</option>)}</select></div><button className="buy" disabled={!p.stock} onClick={()=>add(p)}>{p.stock?"Add to Cart":"Sold Out"}</button></div></article>)}</div></section>
<section className="features"><div>🚚<b> Cash on Delivery</b><small>Available in Nepal</small></div><div>💳<b> eSewa & Khalti</b><small>Payment-ready</small></div><div>📦<b> Easy Checkout</b><small>Fast order placement</small></div></section>
{msg&&<div className="toast">{msg}<button onClick={()=>setMsg("")}>×</button></div>}
{open&&<div className="overlay" onClick={e=>e.target===e.currentTarget&&setOpen(false)}><div className="modal"><button className="x" onClick={()=>setOpen(false)}>×</button><h2>Checkout</h2>{cart.length?<><div>{cart.map((x,i)=><div className="line" key={i}><img src={x.image_url}/><div><b>{x.name}</b><small>{x.size} · {x.color} · Qty {x.qty}</small><strong>Rs. {x.price*x.qty}</strong></div><button onClick={()=>del(i)}>Remove</button></div>)}</div><form onSubmit={order}><input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input required placeholder="Delivery address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><input placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/><select value={form.payment} onChange={e=>setForm({...form,payment:e.target.value})}><option value="cod">Cash on Delivery</option><option value="esewa">eSewa</option><option value="khalti">Khalti</option></select><h3>Total: Rs. {total}</h3><button className="buy">Place Order</button></form></>:<p>Your cart is empty.</p>}</div></div>}
<footer><b>Khudra Market</b><br/>Clothing Store · Nepal</footer>
</main>}