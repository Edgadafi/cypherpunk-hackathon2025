# 🚀 Oracle Market - Prueba Rápida (5 minutos)

## Objetivo
Crear un Oracle Market que se resuelva automáticamente en **2 minutos** para testing rápido.

---

## 📋 Pre-requisitos
- ✅ Wallet conectada (Phantom/Solflare)
- ✅ ~0.1 SOL en Devnet ([Faucet](https://faucet.solana.com))
- ✅ App desplegada en Vercel

---

## 🎯 Ejemplo 1: SOL/USD (Recomendado)

### Paso 1: Consultar Precio Actual
Antes de crear el mercado, checa el precio actual de SOL:
- Visita: https://pyth.network/price-feeds/crypto-sol-usd
- Anota el precio (ejemplo: **$183.50**)

### Paso 2: Crear Oracle Market

**Ir a:** https://tu-app.vercel.app/create-market

**Tab:** `Oracle Market`

**Datos del Mercado:**
```
Título: 🔮 SOL será mayor a $180 en 2 minutos
Descripción: Market de prueba Oracle. Se resuelve automáticamente con Pyth Network.
```

**Configuración Oracle:**
```
Price Feed:        SOL/USD
Comparison:        Greater Than (>)
Threshold:         180.00
End Time:          [HOY] [HORA ACTUAL + 2 minutos]
```

**Ejemplo concreto:**
- Si son las **19:55**, pon **19:57**
- Si SOL está a **$183.50**, el threshold **$180** casi seguro será YES
- Si SOL está a **$177.30**, el threshold **$180** casi seguro será NO

### Paso 3: Hacer una Apuesta (Opcional)
```
Amount:    0.01 SOL
Prediction: YES (si precio actual > threshold)
```

### Paso 4: Esperar 2 Minutos ⏱️
- Toma un café ☕
- Refresca la página del market

### Paso 5: Auto-Resolve
**Verás el botón morado:**
```
🤖 Auto-Resolve with Oracle
Fetch price from Pyth Network and resolve automatically
```

**Click y firma la transacción** → Market resuelto en ~5 segundos

### Paso 6: Claim Winnings
Si apostaste y ganaste:
```
💰 Claim Winnings
You won! Click to claim your winnings.
```

---

## 🎯 Ejemplo 2: BTC/USD (Más Estable)

**Precio actual:** ~$95,000 (checa en Pyth)

```
Título:      🪙 BTC será mayor a $90,000 en 2 min
Price Feed:  BTC/USD
Comparison:  Greater Than (>)
Threshold:   90000.00
End Time:    +2 minutos
```

**Ventaja:** BTC es más estable, menos probabilidad de sorpresas.

---

## 🎯 Ejemplo 3: ETH/USD

**Precio actual:** ~$3,500 (checa en Pyth)

```
Título:      ⚡ ETH será menor a $4,000 en 2 min
Price Feed:  ETH/USD
Comparison:  Less Than (<)
Threshold:   4000.00
End Time:    +2 minutos
```

---

## 📊 Tabla de Referencia Rápida

| Asset | Feed ID (interno) | Aprox. Price | Threshold Seguro | Resultado Esperado |
|-------|-------------------|--------------|------------------|--------------------|
| SOL   | ef0d8b6f...      | $180         | $170 (LOW)       | ✅ YES (>)         |
| SOL   | ef0d8b6f...      | $180         | $190 (HIGH)      | ❌ NO (>)          |
| BTC   | e62df6c8...      | $95,000      | $90,000 (LOW)    | ✅ YES (>)         |
| ETH   | ff61491a...      | $3,500       | $4,000 (HIGH)    | ✅ YES (<)         |

---

## 🔍 Debugging Checklist

**Si el market NO aparece en la lista:**
- ✅ Checa en Solana Explorer: `https://explorer.solana.com/address/[MARKET_ADDRESS]?cluster=devnet`
- ✅ Confirma que la transacción se confirmó

**Si el botón Auto-Resolve NO aparece:**
- ✅ Espera a que `End Time` haya pasado
- ✅ Refresca la página
- ✅ Checa el badge: debe decir `Expired` (no `Active`)

**Si Auto-Resolve falla:**
- ✅ Checa que tengas SOL para fees (~0.001 SOL)
- ✅ Confirma que el Price Feed esté activo en Pyth
- ✅ Mira la consola del navegador (F12) para errores

**Si Claim Winnings NO aparece:**
- ✅ Confirma que el market esté resuelto (`Resolved: Yes/No`)
- ✅ Confirma que TU predicción ganó
- ✅ Confirma que NO has reclamado ya (cada bet solo se reclama 1 vez)

---

## 🚨 Notas Importantes

### Timing
- **End Time** debe estar en el futuro (>= ahora)
- **Auto-Resolve** solo funciona DESPUÉS de End Time
- Pyth actualiza precios cada **~400ms**, así que el precio es casi en tiempo real

### Threshold Format
- **SIN comas:** `90000` ✅ no `90,000` ❌
- **Decimales OK:** `180.50` ✅
- **No $ símbolo:** `180` ✅ no `$180` ❌

### Gas Fees
- Create Market: ~0.005 SOL
- Place Bet: ~0.002 SOL
- Auto-Resolve: ~0.001 SOL
- Claim: ~0.001 SOL
- **Total:** ~0.01 SOL para todo el flujo

---

## 🎬 Demo Script Completo (5 min)

```bash
⏱️ 00:00  →  Ir a /create-market, tab "Oracle Market"
⏱️ 00:30  →  Llenar form (SOL/USD, threshold $170, +2 min)
⏱️ 01:00  →  Crear market (firma tx, espera confirmación)
⏱️ 01:30  →  Ir a página del market, hacer bet 0.01 SOL en YES
⏱️ 02:00  →  Esperar 2 min (tomar café ☕)
⏱️ 04:00  →  Refrescar, click Auto-Resolve (firma tx)
⏱️ 04:30  →  Ver resultado, click Claim Winnings
⏱️ 05:00  →  ✅ Test completo
```

---

## 💡 Tips Pro

### Para Testing Rápido
- Usa **2 minutos** de duración (mínimo práctico)
- Usa **thresholds fáciles** (muy por debajo/encima del precio actual)
- Prueba **SOL/USD** primero (es el que mejor conoces)

### Para Demo Real
- Usa **15-30 minutos** de duración (más realista)
- Usa **thresholds competitivos** (50/50 probability)
- Añade **apuestas de otros usuarios** (pide a amigos)

### Para Debugging
- Abre **Consola (F12)** antes de crear market
- Copia el **Market Address** después de crear
- Guarda el **Transaction Signature** de cada paso

---

## 🔗 Links Útiles

- **Pyth Price Feeds:** https://pyth.network/developers/price-feed-ids
- **Pyth Network App:** https://pyth.network/price-feeds
- **Solana Explorer:** https://explorer.solana.com/?cluster=devnet
- **Solana Devnet Faucet:** https://faucet.solana.com/

---

## ✅ Checklist de Testing

- [ ] Market creado exitosamente
- [ ] Market aparece en `/markets`
- [ ] Bet colocado correctamente
- [ ] Badge cambia de `Active` a `Expired`
- [ ] Botón `Auto-Resolve` aparece
- [ ] Auto-Resolve ejecuta sin errores
- [ ] Market muestra resultado (`Resolved: Yes/No`)
- [ ] Botón `Claim Winnings` aparece
- [ ] Winnings reclamados exitosamente
- [ ] Balance actualizado en wallet

---

¡Listo para probar! 🚀

