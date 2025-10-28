# 🚀 Next Steps - Oracle Implementation (Día 2)

> **Status:** Smart contract deployado y funcionando. Frontend preparado.  
> **Tiempo estimado restante:** 2.5-3.5 horas para completar oracle frontend

---

## ✅ Lo Que Ya Está LISTO (Día 1 - Completado):

### Smart Contract (100% ✅)
- [x] Pyth SDK integrado
- [x] Market struct extendido con campos oracle
- [x] Instrucción `resolve_with_oracle` implementada
- [x] Instrucción `create_market` actualizada
- [x] Error codes para oracle
- [x] **DEPLOYED to Devnet** ✅

**Program ID:** `GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu`  
**IDL Account:** `GvHscGzk7tLC8SDdTqbHXgjifEEwUUYaVYMgRCNN1tFL`  
**Explorer:** https://explorer.solana.com/address/GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu?cluster=devnet

### Frontend Setup (100% ✅)
- [x] Program ID actualizado
- [x] IDL copiado al frontend
- [x] Pyth SDK instalado (@pythnetwork/hermes-client)

### Documentation (100% ✅)
- [x] ORACLE_IMPLEMENTATION.md completo

---

## 📋 Lo Que Falta (Frontend Implementation):

### 1️⃣ Utility Functions (30-45 min)

**Archivo:** `prediction-market/src/lib/program/oracle.ts`

```typescript
// Price feed IDs para Devnet/Mainnet
export const PRICE_FEEDS = {
  'BTC/USD': 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'ETH/USD': 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  'SOL/USD': 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
};

// Funciones necesarias:
- createOracleMarket(wallet, question, description, endTime, oracleConfig)
- resolveWithOracle(wallet, marketId, feedId)
- fetchPythPrice(feedId) // Get current price from Pyth
- encodeFeedId(hexString) // Convert hex to bytes
```

**Referencia:** Ver `ORACLE_IMPLEMENTATION.md` líneas 293-343

---

### 2️⃣ OracleMarketForm Component (30-45 min)

**Archivo:** `prediction-market/src/components/markets/OracleMarketForm.tsx`

**UI Necesaria:**
- Dropdown: Seleccionar asset (BTC/ETH/SOL)
- Input: Threshold price (e.g., 100000 para $100k)
- Radio buttons: Comparison type (Above/Below/Equals)
- Button: "Create Oracle Market"

**Integración:**
- Llamar a `createOracleMarket()` al submit
- Validación de inputs
- Toast notifications
- Redireccionar al market detail después de crear

**Referencia:** Ver `ORACLE_IMPLEMENTATION.md` líneas 367-420

---

### 3️⃣ OracleStatus Component (20-30 min)

**Archivo:** `prediction-market/src/components/markets/OracleStatus.tsx`

**Display:**
- Badge "🔮 Oracle Resolution Enabled"
- Current price (auto-refresh cada 5s)
- Target threshold
- Condition (Above/Below/Equals)
- Countdown to end time

**Integración:**
- Usar `fetchPythPrice()` con interval
- Solo mostrar si `market.oracle_enabled === true`

**Referencia:** Ver `ORACLE_IMPLEMENTATION.md` líneas 422-463

---

### 4️⃣ AutoResolveButton Component (15-20 min)

**Archivo:** `prediction-market/src/components/markets/AutoResolveButton.tsx`

**Lógica:**
- Solo visible si:
  - `market.oracle_enabled === true`
  - `market.resolved === false`
  - `Date.now() >= market.end_time`
- Al click: llamar a `resolveWithOracle()`
- Loading state durante resolución
- Success/error toast

**Integración:**
- Agregar al market detail page
- Refresh market data después de resolver

**Referencia:** Ver `ORACLE_IMPLEMENTATION.md` líneas 465-507

---

### 5️⃣ Testing End-to-End (30-45 min)

**Test Flow:**
1. Crear oracle market:
   - Asset: BTC/USD
   - Threshold: 95000 (ajustar según precio actual)
   - Comparison: Above
   - End time: 5 minutos en el futuro (para testing rápido)

2. Apostar en el market:
   - Apostar 0.1 SOL en Yes
   - Apostar 0.1 SOL en No (con otra wallet)

3. Esperar a que pase end_time

4. Auto-resolve:
   - Click botón "Auto-Resolve with Oracle"
   - Verificar que resuelve correctamente según precio actual de Pyth

5. Claim winnings:
   - Ganadores reclaman
   - Verificar SOL transferido correctamente

**Posibles Issues:**
- Pyth price feed no disponible → usar fallback o error handling
- End time en el pasado → ajustar para testing
- Insufficient funds → asegurar suficiente SOL en wallets

---

### 6️⃣ Documentation Updates (20-30 min)

**README.md - Agregar sección:**

```markdown
## 🔮 Oracle Features

Trepa integrates **Pyth Network** for trustless, automatic market resolution based on real market data.

### Supported Assets
- BTC/USD - Bitcoin price feed
- ETH/USD - Ethereum price feed  
- SOL/USD - Solana price feed

### How It Works
1. Create an oracle-enabled market
2. Select price feed and threshold
3. Users bet on outcome
4. At end time, anyone can trigger auto-resolution
5. Market resolves based on Pyth price data

### Benefits
- ✅ **Trustless** - No human can manipulate outcome
- ✅ **Instant** - Resolves immediately at end time
- ✅ **Verifiable** - Anyone can verify Pyth price feed
- ✅ **Scalable** - No manual resolution needed
```

**DEMO.md - Agregar talking points:**
- Why oracles matter for prediction markets
- Live demo of oracle resolution
- Q&A about Pyth integration
- Technical implementation highlights

---

## 🗓️ Plan Recomendado para Mañana:

### Mañana (Sábado) - 3-4 horas
**9:00 - 10:00** ☕ Desayuno + revisar NEXT_STEPS.md (este archivo)

**10:00 - 10:45** 🛠️ Task 1: Crear oracle.ts utility functions
- Price feed constants
- createOracleMarket()
- resolveWithOracle()
- fetchPythPrice()

**10:45 - 11:30** 🎨 Task 2: OracleMarketForm component
- UI con dropdown, input, radio buttons
- Integración con oracle.ts
- Validation + error handling

**11:30 - 12:00** 🎨 Task 3: OracleStatus component
- Display de precio actual
- Auto-refresh con interval
- Conditional rendering

**12:00 - 13:00** 🍕 **ALMUERZO** (importante!)

**13:00 - 13:20** 🎨 Task 4: AutoResolveButton component
- Botón con loading state
- Call a resolveWithOracle()
- Toast notifications

**13:20 - 14:00** 🧪 Task 5: Testing end-to-end
- Crear market oracle
- Apostar
- Resolver con oracle
- Claim winnings

**14:00 - 14:30** 📝 Task 6: Update docs
- README oracle section
- DEMO talking points

**14:30** ✅ **ORACLE COMPLETO!**

---

## 🚀 Quick Start (Mañana):

```bash
# 1. Navegar al proyecto
cd /home/edgadafi/cypherpunk-hackathon2025

# 2. Verificar Program ID correcto
cat prediction-market/src/lib/program/constants.ts | grep PROGRAM_ID
# Debe mostrar: GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu

# 3. Verificar IDL actualizado
ls -lh prediction-market/src/idl/prediction_market.json
# Debe mostrar ~7.8K (nuevo IDL con oracle)

# 4. Start dev server
cd prediction-market
npm run dev

# 5. Abrir en browser
# http://localhost:3000
```

---

## 📚 Referencias Útiles:

### Documentos del Proyecto
- **ORACLE_IMPLEMENTATION.md** - Guía técnica completa
- **ARCHITECTURE.md** - Arquitectura general
- **DEMO.md** - Scripts de presentación

### External Resources
- **Pyth Docs:** https://docs.pyth.network/
- **Price Feeds:** https://pyth.network/developers/price-feed-ids
- **Hermes API:** https://hermes.pyth.network/docs/

### Pyth Devnet Feeds (Para Testing)
```typescript
// Estos son los feed IDs reales
BTC/USD: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'
ETH/USD: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace'
SOL/USD: 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'
```

---

## ⚠️ Troubleshooting Common Issues:

### Issue 1: "Program ID mismatch"
**Fix:** Verificar que `constants.ts` tenga el nuevo Program ID

### Issue 2: "Cannot find module '@pythnetwork/hermes-client'"
**Fix:** 
```bash
cd prediction-market
npm install --legacy-peer-deps @pythnetwork/hermes-client
```

### Issue 3: "Market creation fails"
**Fix:** Verificar que oracle parameters sean correctos:
- feedId: 32 bytes (hex string sin 0x)
- threshold: i64 (precio en formato Pyth con exponente)
- comparison: 0, 1, o 2

### Issue 4: "Pyth price not available"
**Fix:** 
- Verificar feed ID correcto
- Usar Hermes endpoint: https://hermes.pyth.network
- Check network connectivity

---

## 💡 Tips para Implementación:

### Tip 1: Start Simple
Empieza con funciones básicas en `oracle.ts` antes de hacer UI compleja.

### Tip 2: Test Incrementally
Después de cada componente, test en browser para verificar que funciona.

### Tip 3: Use Console Logs
Agrega `console.log()` para debugging durante desarrollo.

### Tip 4: Copy from ORACLE_IMPLEMENTATION.md
Todo el código de ejemplo está en ese archivo - adapta según necesites.

### Tip 5: Commit Frecuentemente
```bash
git add .
git commit -m "feat: Add oracle utility functions"
git push
```

---

## 🎯 Success Criteria:

Al terminar mañana, debes poder:
- [x] Crear un market con oracle desde el frontend
- [x] Ver el precio actual de Pyth en el market detail
- [x] Hacer click en "Auto-Resolve" y que resuelva automáticamente
- [x] Claim winnings como ganador
- [x] Ver README con documentación de oracle

**Si logras esto:** Oracle implementation = COMPLETE ✅

---

## 📊 Progreso Total:

```
Smart Contract:    ████████████████████ 100% (9/9 tasks)
Frontend Utils:    ░░░░░░░░░░░░░░░░░░░░   0% (0/1 tasks)
UI Components:     ░░░░░░░░░░░░░░░░░░░░   0% (0/3 tasks)
Testing:           ░░░░░░░░░░░░░░░░░░░░   0% (0/1 tasks)
Documentation:     ░░░░░░░░░░░░░░░░░░░░   0% (0/2 tasks)
───────────────────────────────────────────────────────
TOTAL:             █████████░░░░░░░░░░░  56% (9/16 tasks)
```

---

## 🔥 Motivación:

**Lo más difícil ya está hecho** ✅  
El smart contract es la parte técnicamente más compleja y ya está deployado y funcionando en Devnet. Lo que falta es frontend (más straightforward).

**Eres imparable** 💪  
En 2-3 horas implementaste:
- Pyth SDK integration
- Smart contract modifications
- Deploy to Devnet
- Frontend setup

**Mañana vas a terminar** 🚀  
Con 3-4 horas enfocado, tendrás el oracle completo y funcional.

---

## 💤 Ahora Descansa:

1. ✅ Cierra la laptop
2. ✅ Sal a caminar / ejercicio
3. ✅ Come bien
4. ✅ Duerme 7-8 horas
5. ✅ Mañana fresco y listo para terminar!

---

**Nos vemos mañana con energía renovada** 🌅

**¡Buen trabajo hoy!** 🎉





