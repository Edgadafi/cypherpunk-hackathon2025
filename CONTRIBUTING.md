# Contributing to PrismaFi

Thank you for your interest in contributing to PrismaFi! This document provides guidelines and instructions for contributing.

---

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, wallet, network)

### Suggesting Features

Feature suggestions are welcome! Open an issue with:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if you have ideas)
- Any relevant examples

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** on Solana Devnet
5. **Commit with clear messages** (`git commit -m 'Add amazing feature'`)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

---

## 📋 Development Guidelines

### Code Style

**TypeScript/React:**
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable names

**Rust/Smart Contracts:**
- Follow Rust naming conventions
- Use Anchor framework patterns
- Add comprehensive error handling
- Document complex logic

**Styling:**
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Maintain responsive design
- Test on mobile devices

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add stablecoin support for betting
fix: Resolve edge case in claim_winnings
docs: Update README with v2 roadmap
refactor: Improve error handling in betting interface
test: Add unit tests for market resolution
```

### Testing

**Before submitting a PR:**
- [ ] Test on Solana Devnet
- [ ] Test with Phantom wallet
- [ ] Test error cases
- [ ] Test on mobile (responsive)
- [ ] Check for TypeScript errors
- [ ] Check for linting errors

---

## 🏗️ Project Structure

```
cypherpunk-hackathon2025/
├── prediction-market/          # Next.js frontend
│   ├── src/
│   │   ├── app/               # Pages
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities
│   │   └── hooks/            # Custom hooks
│   └── public/               # Static assets
│
├── prediction-market-latam/    # Smart contracts
│   ├── programs/
│   │   └── prediction-market/ # Anchor program
│   └── tests/                 # Contract tests
│
├── docs/                      # Documentation
└── README.md                  # Main README
```

---

## 🎯 Priority Areas for Contribution

### High Priority
- **Stablecoin Support (v2)** - USDC/USDT integration
- **On-Ramp/Off-Ramp** - Fiat conversion
- **Mobile App** - React Native implementation
- **Security Audit** - Smart contract review

### Medium Priority
- **Scalar Markets** - Continuous value betting
- **Advanced Analytics** - Charts and graphs
- **Notification System** - Email/SMS/push
- **API Development** - Public API for bots

### Low Priority
- **Multi-language Support** - i18n
- **Dark/Light Mode** - Theme toggle
- **Advanced Filtering** - More search options
- **Market Templates** - Pre-configured markets

---

## 🔧 Setup for Development

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Solana CLI 1.18+
- Anchor CLI 0.30+
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025

# Setup frontend
cd prediction-market
npm install --legacy-peer-deps

# Setup smart contracts
cd ../prediction-market-latam
anchor build
```

### Environment Variables

Create `.env.local` in `prediction-market/`:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id
```

---

## 📝 Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add/update code comments
   - Update CHANGELOG.md

2. **Ensure Tests Pass**
   - Run `npm test` (when available)
   - Test manually on Devnet
   - Check for linting errors

3. **Request Review**
   - Tag relevant maintainers
   - Describe changes clearly
   - Link related issues

4. **Address Feedback**
   - Respond to comments
   - Make requested changes
   - Update PR as needed

---

## 🐛 Bug Fix Guidelines

When fixing bugs:
1. **Reproduce the bug** - Confirm it exists
2. **Identify root cause** - Understand why it happens
3. **Write a fix** - Solve the problem
4. **Test the fix** - Ensure it works
5. **Add tests** - Prevent regression (if applicable)
6. **Document** - Update docs if needed

---

## 💡 Feature Development Guidelines

When adding features:
1. **Discuss first** - Open an issue to discuss
2. **Plan the implementation** - Design before coding
3. **Follow existing patterns** - Maintain consistency
4. **Test thoroughly** - Cover edge cases
5. **Update documentation** - Help others understand

---

## 📚 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ❓ Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues/PRs

---

## 🙏 Thank You!

Your contributions make PrismaFi better for everyone. We appreciate your time and effort!

---

**Happy coding! 🚀**
