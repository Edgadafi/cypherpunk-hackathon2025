# 🚀 Prueba Oracle AHORA - 2 Minutos

## ✅ Cambios Aplicados

**Acabamos de arreglar:**
1. ✅ Error de transacción (`InstructionFallbackNotFound`) → RESUELTO
2. ✅ Texto blanco sobre fondo blanco → RESUELTO  
3. ✅ Date picker no permitía mismo día → RESUELTO

---

## 📝 Instrucciones Paso a Paso

### 1. Ve a la App
```
https://tu-app.vercel.app/create-market
```

### 2. Selecciona Tab "Oracle Market"
*(Ya debería verse con texto negro legible)*

### 3. Llena el Formulario

#### **Market Question:**
```
🔮 SOL será mayor a $150 en 2 minutos
```

#### **Resolution Criteria:**
```
Market de prueba Oracle. Se resuelve automáticamente con Pyth Network cuando el precio de SOL/USD sea mayor a $150.
```

#### **End Date:**
```
[Selecciona HOY] - Ahora funciona ✅
```

#### **End Time (UTC):**
```
[HORA ACTUAL + 2 minutos]
```
**Ejemplo:** Si ahora son las 20:15 UTC, pon **20:17**

**💡 Para saber tu hora UTC actual:**
- Googlea "hora UTC actual"
- O resta tu zona horaria (México = UTC-6, entonces 14:00 local = 20:00 UTC)

#### **Oracle Configuration:**

**Price Feed:**
```
SOL/USD
```

**Target Price (USD):**
```
150
```
*(Si SOL está a ~$180, este threshold casi seguro será YES)*

**Condition:**
```
Price is ABOVE threshold (greater than)
```

### 4. Click "Create Oracle Market"
- Firma la transacción
- Espera confirmación (~5 segundos)
- ✅ Market creado!

### 5. (Opcional) Hacer una Apuesta
- Ve al market que acabas de crear
- Amount: `0.01 SOL`
- Prediction: `YES`
- Firma la transacción

### 6. Esperar 2 Minutos ⏱️
- Ve a tomar café ☕
- Refresca la página del market

### 7. Auto-Resolve
- Deberías ver botón morado: **"🤖 Auto-Resolve with Oracle"**
- Click y firma la transacción
- Market resuelto en ~5 segundos

### 8. Claim Winnings (si apostaste)
- Botón verde: **"💰 Claim Winnings"**
- Click y recibe tus ganancias

---

## 🎯 Valores Recomendados para Testing Rápido

### Opción A: SOL (Recomendado)
```
Price Feed:     SOL/USD
Threshold:      150
Comparison:     ABOVE (>)
Duration:       +2 minutos
```
**Por qué funciona:** SOL está ~$180, muy por encima de $150

### Opción B: BTC (Más estable)
```
Price Feed:     BTC/USD
Threshold:      90000
Comparison:     ABOVE (>)
Duration:       +2 minutos
```
**Por qué funciona:** BTC está ~$95,000, muy por encima de $90,000

### Opción C: ETH
```
Price Feed:     ETH/USD
Threshold:      4000
Comparison:     BELOW (<)
Duration:       +2 minutos
```
**Por qué funciona:** ETH está ~$3,500, por debajo de $4,000

---

## 🔍 Troubleshooting

### "No veo los campos" → Refresca la página
El nuevo deploy puede tardar ~30 segundos en propagarse

### "Simulation failed" → Checa:
- ✅ End Time está en el futuro (>= ahora)
- ✅ Threshold es un número válido (sin comas ni símbolos)
- ✅ Tienes al menos 0.01 SOL en tu wallet

### "No aparece el botón Auto-Resolve" → Checa:
- ✅ End Time ya pasó
- ✅ Market NO está resuelto aún
- ✅ Refresca la página (F5)

### "Auto-Resolve falla" → Checa:
- ✅ Tienes ~0.01 SOL para fees
- ✅ Abre consola (F12) y comparte el error

---

## 📊 Checklist Completo

- [ ] Tab "Oracle Market" seleccionado
- [ ] Todos los campos llenos (texto negro visible)
- [ ] End Date = HOY (mismo día funciona ahora)
- [ ] End Time = +2 minutos desde ahora (en UTC)
- [ ] Price Feed = SOL/USD
- [ ] Threshold = 150
- [ ] Condition = ABOVE
- [ ] Click "Create Oracle Market"
- [ ] Transacción confirmada
- [ ] (Opcional) Apostar 0.01 SOL en YES
- [ ] Esperar 2 minutos
- [ ] Refrescar página
- [ ] Ver botón "Auto-Resolve"
- [ ] Click y firmar
- [ ] Market resuelto ✅
- [ ] (Si apostaste) Claim winnings

---

## 🚨 Notas Importantes

### Threshold Format
- **SIN comas:** `150` ✅ no `150.00` ni `$150`
- Pyth convierte automáticamente a 8 decimales (15000000000)

### Timing
- End Time debe estar en **UTC** (no tu zona horaria local)
- El sistema valida que End Time > ahora
- Auto-Resolve solo funciona DESPUÉS de End Time

### Gas Fees
- Create Market: ~0.005 SOL
- Place Bet: ~0.002 SOL
- Auto-Resolve: ~0.001 SOL
- Claim: ~0.001 SOL

---

## 🎬 Script de 2 Minutos

```bash
⏱️ 00:00  Ir a /create-market → Tab "Oracle Market"
⏱️ 00:20  Llenar: SOL/USD, $150, ABOVE, +2 min
⏱️ 00:40  Crear market (firma tx)
⏱️ 01:00  Hacer bet 0.01 SOL YES
⏱️ 01:20  [ESPERAR] ☕
⏱️ 03:00  Refrescar, Auto-Resolve
⏱️ 03:30  Claim Winnings
⏱️ 04:00  ✅ DONE
```

---

¡Ahora sí debería funcionar todo! 🎉

Si encuentras algún error, comparte:
1. Screenshot del error
2. Console logs (F12 → Console)
3. Transaction signature (si aplica)

