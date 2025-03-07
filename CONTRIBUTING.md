# Contributing to Calendxr

First off, thank you for considering contributing to Calendxr! It's people like you that make Calendxr such a great tool. We welcome contributions from everyone, regardless of their level of experience.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript/TypeScript Styleguide](#javascripttypescript-styleguide)
  - [Python Styleguide](#python-styleguide)
  - [Documentation Styleguide](#documentation-styleguide)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the Calendxr Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

Our Code of Conduct is simple:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

Before you begin:
- Make sure you have a [GitHub account](https://github.com/signup/free)
- Familiarize yourself with the [project documentation](https://github.com/nobu-h-o/Calendxr)
- Check the README.md for setup instructions

## Development Environment

Please refer to the [README.md](README.md) for detailed setup instructions. Here's a quick summary:

1. Fork the repository
2. Clone your fork locally
3. Set up environment variables in both frontend and backend directories
4. Set up dependencies with npm for frontend and Poetry for backend
5. Run the development servers

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the issue, and find related reports.

Before creating bug reports, please check the issue tracker as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible.

**How Do I Submit A Good Bug Report?**

Bugs are tracked as [GitHub issues](https://github.com/nobu-h-o/Calendxr/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **If the problem is related to performance or memory**, include a CPU profile capture with your report.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**How Do I Submit A Good Enhancement Suggestion?**

Enhancement suggestions are tracked as [GitHub issues](https://github.com/nobu-h-o/Calendxr/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps** or ideas.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Calendxr which the suggestion is related to.
- **Explain why this enhancement would be useful** to most Calendxr users.
- **List some other applications where this enhancement exists**, if applicable.

### Pull Requests

The process described here has several goals:
- Maintain Calendxr's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Calendxr
- Enable a sustainable system for Calendxr's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in the template
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

#### Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md or relevant documentation with details of changes to the interface, including new environment variables, exposed ports, useful file locations, etc.
3. The PR should work for both frontend and backend (if applicable). Ensure tests pass for both environments.
4. The PR may be merged once it receives approval from at least one other developer and project maintainer.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies
    * 👕 `:shirt:` when removing linter warnings

### JavaScript/TypeScript Styleguide

* Use ES6/ES2015+ syntax when possible
* Use camelCase for variables and functions
* Use PascalCase for classes and React components
* Use 2 spaces for indentation
* End files with a single newline
* Use semicolons at the end of statements
* Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* Add appropriate JSDoc comments for functions and classes

### Python Styleguide

* Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for code style
* Use docstrings for functions and classes following [PEP 257](https://www.python.org/dev/peps/pep-0257/)
* Use 4 spaces for indentation
* Use snake_case for variables and functions
* Use PascalCase for classes
* Limit lines to 79 characters
* Use type hints when applicable

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown/) for documentation
* Include code examples when relevant
* Document all public APIs
* Update documentation with any relevant changes
* Ensure documentation is clear and accessible to both technical and non-technical users

## Community

Feel free to join our community discussions and ask questions:

* Join the discussion on GitHub issues
* Follow updates and announcements on our GitHub repository

Thank you for contributing to Calendxr! Your efforts help make this project better for everyone.
