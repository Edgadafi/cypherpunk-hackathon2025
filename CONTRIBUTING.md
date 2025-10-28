# 🤝 Contributing to Trepa

Thank you for your interest in contributing to Trepa! We welcome contributions from everyone.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)
8. [Community](#community)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How to Contribute

### Types of Contributions

We welcome many types of contributions:

1. **🐛 Bug Reports** - Found a bug? Let us know!
2. **💡 Feature Requests** - Have an idea? Share it!
3. **📝 Documentation** - Improve our docs
4. **💻 Code** - Fix bugs or add features
5. **🎨 Design** - Improve UI/UX
6. **🧪 Testing** - Write tests or test features
7. **🌐 Translations** - Help us go global

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/cypherpunk-hackathon2025.git
   cd cypherpunk-hackathon2025
   ```
3. **Create a branch** for your changes
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and commit them
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** on GitHub

---

## Development Setup

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.18+
- Anchor CLI 0.30+

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed installation instructions.

### Local Setup

```bash
# Clone repository
git clone https://github.com/Edgadafi/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025

# Install frontend dependencies
cd prediction-market
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

### Smart Contract Development

```bash
# Build contract
cd prediction-market-latam
anchor build

# Test contract
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

---

## Pull Request Process

### Before Submitting

1. ✅ **Test your changes** - Ensure everything works
2. ✅ **Follow coding standards** - Run linter/formatter
3. ✅ **Update documentation** - If you changed behavior
4. ✅ **Write clear commit messages** - Explain what and why
5. ✅ **Keep PRs focused** - One feature/fix per PR

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass
- [ ] PR title is descriptive
- [ ] PR description explains changes

### PR Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
[Describe testing steps]

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] My code follows the project style
- [ ] I have self-reviewed my code
- [ ] I have added tests
- [ ] All tests pass
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs
2. **Code Review** - Maintainers review your code
3. **Changes Requested** - Address feedback if any
4. **Approval** - Once approved, we'll merge!

---

## Coding Standards

### TypeScript/JavaScript

```typescript
// ✅ Good: Use TypeScript types
interface Market {
  id: string;
  question: string;
  endTime: number;
}

// ✅ Good: Use meaningful names
const fetchActiveMarkets = async () => { ... }

// ❌ Bad: Vague names
const getData = async () => { ... }

// ✅ Good: Add comments for complex logic
// Calculate proportional winnings based on pool distribution
const winnings = (bet.amount / totalWinningBets) * totalLosingPool;

// ✅ Good: Use const/let, not var
const market = await fetchMarket(id);
let counter = 0;

// ❌ Bad: Using var
var market = await fetchMarket(id);
```

### Formatting

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

We use ESLint for code quality:

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Rust/Anchor

```rust
// ✅ Good: Use descriptive names
pub fn create_market(
    ctx: Context<CreateMarket>,
    question: String,
    end_time: i64,
) -> Result<()> { ... }

// ✅ Good: Add validation
require!(
    question.len() >= 10 && question.len() <= 200,
    ErrorCode::InvalidQuestionLength
);

// ✅ Good: Document public functions
/// Creates a new prediction market
/// 
/// # Arguments
/// * `question` - Market question (10-200 chars)
/// * `end_time` - Market end time (unix timestamp)
pub fn create_market(...) -> Result<()> { ... }

// ✅ Good: Use proper error handling
let market = ctx.accounts.market.load_mut()?;
```

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat: Add new feature
fix: Fix a bug
docs: Documentation changes
style: Code style (formatting, etc.)
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks

# Examples:
git commit -m "feat(markets): Add search functionality"
git commit -m "fix(betting): Correct odds calculation"
git commit -m "docs: Update README installation steps"
```

---

## Testing Guidelines

### Frontend Testing

```typescript
// Unit tests (coming soon)
describe('calculateOdds', () => {
  it('should calculate correct implied probability', () => {
    const odds = calculateOdds(100, 50);
    expect(odds).toBe(66.67);
  });
});

// Integration tests
describe('Market Creation', () => {
  it('should create market successfully', async () => {
    const result = await createMarket({
      question: 'Test market?',
      endTime: Date.now() + 86400000,
    });
    expect(result).toBeTruthy();
  });
});
```

### Smart Contract Testing

```rust
// Anchor test example
#[tokio::test]
async fn test_create_market() {
    let market = create_test_market(&program).await;
    
    assert_eq!(market.question, "Test market?");
    assert_eq!(market.resolved, false);
    assert_eq!(market.total_yes_amount, 0);
}
```

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Market creation works
- [ ] Betting works (Yes/No)
- [ ] Odds update correctly
- [ ] Dashboard shows correct stats
- [ ] Leaderboard rankings are accurate
- [ ] Profile page loads
- [ ] Real-time refresh works
- [ ] Mobile responsive
- [ ] Works in Chrome, Firefox, Safari

---

## Documentation

### When to Update Docs

Update documentation if you:

- Add a new feature
- Change existing behavior
- Fix a bug that wasn't obvious
- Add new configuration options
- Change API/contract interface

### Documentation Locations

- **README.md** - Project overview, quick start
- **ARCHITECTURE.md** - Technical decisions, patterns
- **DEPLOYMENT.md** - Deployment instructions
- **DEMO.md** - Presentation guide
- **Code comments** - Complex logic inline

### Writing Good Docs

```markdown
# ✅ Good: Clear, concise, with examples

## Creating a Market

To create a new prediction market:

1. Connect your wallet
2. Click "Create Market"
3. Fill in the form:
   - Question (10-200 chars)
   - Description (resolution criteria)
   - End date/time

Example:
\`\`\`typescript
const market = await createMarket({
  question: 'Will Bitcoin reach $100k in 2025?',
  description: 'Resolves Yes if BTC > $100k...',
  endTime: 1735689600,
});
\`\`\`

# ❌ Bad: Vague, no examples

## Markets

You can make markets. Just fill out the form.
```

---

## Community

### Get Help

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - Questions, ideas, feedback
- **Discord** (coming soon) - Real-time chat
- **Twitter** (coming soon) - Updates, announcements

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked on social media (with permission)

Top contributors may receive:
- Special role in Discord
- Early access to new features
- NFT/POAP for significant contributions
- Governance tokens (when launched)

---

## Areas We Need Help

### High Priority 🔥

- [ ] Smart contract audit
- [ ] Automated tests (frontend + contract)
- [ ] Mobile app (React Native)
- [ ] Scalar markets implementation
- [ ] Oracle integration (Chainlink/Pyth)

### Medium Priority 🔶

- [ ] Advanced charts & analytics
- [ ] Notification system
- [ ] Improved error messages
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)

### Good First Issues 🌱

- [ ] Fix typos in documentation
- [ ] Add more examples to docs
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Improve mobile UI

---

## Issue Labels

We use these labels to organize issues:

- `bug` - Something isn't working
- `feature` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `enhancement` - Improvement to existing feature
- `question` - Further information requested
- `wontfix` - Won't be worked on

---

## Questions?

If you have questions about contributing:

1. Check existing GitHub Issues/Discussions
2. Search documentation
3. Ask in Discord (coming soon)
4. Open a new GitHub Discussion
5. Email: [your-email@trepa.finance]

---

## Thank You! 🙏

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in helping make Trepa better!

**Happy coding! 🚀**





