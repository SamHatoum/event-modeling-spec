# Event Modeling Spec 📋

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.12+-brightgreen.svg)](https://pnpm.io/)
[![Zod](https://img.shields.io/badge/Powered%20by-Zod-purple.svg)](https://zod.dev/)

A TypeScript schema and validation library for [Event Modeling](https://eventmodeling.org/), the practice established by Adam Dymitruk. This project provides a strongly-typed schema definition for creating and validating Event Models.

## 🚀 Features

- **Type-safe schemas** using Zod for validation
- **JSON Schema generation** for integration with other tools
- **Event modeling patterns**: State Changes, State Views, Automations, and Translations

## 📦 Installation

This project uses [pnpm](https://pnpm.io/) as its package manager.

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Clone the repository
git clone https://github.com/your-username/event-modeling-spec.git
cd event-modeling-spec

# Install dependencies
pnpm install
```

## 🛠️ Usage

### Generate JSON Schema

```bash
pnpm generate
```

This will create a JSON schema file at `.dist/event-modeling-schema.json`.

### Validate Examples

```bash
pnpm validate
```

This runs the e-commerce example to ensure the schema is working correctly.

## 🤝 Contributing

We welcome contributions from the Event Modeling community! Here's how you can help:

1. **Join the Discussion** 💬
   - Discord channel: https://discord.gg/V4gbFsvT
   - Share your ideas and feedback

2. **Submit Changes** 🔧
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-feature`)
   - Commit your changes (`git commit -m 'Add amazing feature'`)
   - Push to the branch (`git push origin feature/amazing-feature`)
   - Open a Pull Request

3. **Report Issues** 🐛
   - Use GitHub Issues to report bugs or suggest enhancements
   - Please include examples and clear descriptions

4. **Improve Documentation** 📚
   - Help us improve examples and documentation
   - Add more real-world event modeling scenarios

## 📁 Project Structure

```
event-modeling-spec/
├── src/
│   ├── event-modeling-schema.ts    # Core schema definitions
│   └── example-ecommerce.ts        # E-commerce example implementation
├── package.json                    # Project dependencies and scripts
└── README.md                       # This file
```

## 🎯 Schema Overview

The schema supports four main Event Modeling patterns:

- **State Changes** (Command → Event): Handle commands that change system state
- **State Views** (Event → State): Project events into read models
- **Automations** (Event → Command): Trigger commands based on events or schedules
- **Translations** (External Event → Internal Event): Integrate with external systems

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Event Modeling community
