# Codebase Architecture Analysis Prompt

Use this prompt with any AI assistant to get a comprehensive analysis of a codebase's architecture and functionality.

---

## The Prompt

```
You are a senior software architect tasked with analyzing a codebase and producing a clear, structured explanation of its architecture and functionality. Please analyze the provided codebase and create a comprehensive architectural overview.

**Analysis Framework:**

1. **Project Overview & Purpose**
   - What does this application/system do?
   - What problem does it solve?
   - What type of application is it (web app, API, CLI tool, library, etc.)?

2. **Technology Stack Analysis**
   - Programming language(s) and versions
   - Frameworks and libraries used
   - Database systems and ORMs
   - Build tools and package managers
   - Testing frameworks
   - Deployment and infrastructure tools

3. **Architecture Pattern**
   - Overall architectural pattern (MVC, microservices, layered, hexagonal, etc.)
   - Design patterns employed
   - Separation of concerns approach

4. **Directory Structure & Organization**
   - High-level folder organization
   - Purpose of major directories
   - File naming conventions
   - Module/package structure

5. **Core Components & Flow**
   - Entry points and initialization
   - Main application flow
   - Key modules and their responsibilities
   - Data flow through the system
   - Request/response lifecycle (if applicable)

6. **Data Layer**
   - Database schema and models
   - Data access patterns
   - Migration strategy
   - Caching mechanisms (if any)

7. **API/Interface Design**
   - External APIs or endpoints
   - Input/output formats
   - Authentication and authorization
   - Error handling strategies

8. **Configuration & Environment**
   - Environment variables and configuration
   - Different environments (dev, staging, prod)
   - Feature flags or toggles

9. **Security Considerations**
   - Authentication mechanisms
   - Authorization patterns
   - Input validation and sanitization
   - Security headers and protections

10. **Development Workflow**
    - Build and deployment process
    - Testing strategy and coverage
    - Code quality tools (linting, formatting)
    - Development server setup

11. **Dependencies & Integration**
    - Third-party services integration
    - External APIs consumed
    - Message queues or event systems
    - File storage and media handling

12. **Performance & Scalability**
    - Performance optimizations
    - Caching strategies
    - Database indexing and optimization
    - Scalability considerations

**Output Format:**

Structure your analysis as follows:

# [Project Name] - Architecture Analysis

## Executive Summary
[2-3 sentences describing what the system does and its primary purpose]

## Technology Stack
- **Language:** [Primary language(s)]
- **Framework:** [Main framework(s)]
- **Database:** [Database system(s)]
- **Key Libraries:** [Important dependencies]

## Architecture Overview
[Describe the overall architectural pattern and approach]

## System Components
### [Component 1 Name]
- **Purpose:** [What it does]
- **Key Files:** [Important files/modules]
- **Dependencies:** [What it depends on]

[Repeat for each major component]

## Data Flow
[Describe how data moves through the system]

## Key Workflows
### [Workflow 1 Name]
1. [Step 1]
2. [Step 2]
3. [Step n]

[Repeat for major workflows]

## Development Setup
[Key commands and setup instructions]

## Security & Authentication
[Security measures and authentication flow]

## Notable Patterns & Decisions
[Interesting architectural decisions or patterns used]

## Areas for Improvement
[Potential architectural improvements or concerns]

**Instructions for Analysis:**

1. Start by examining package.json, requirements.txt, or similar dependency files
2. Look at the main entry points and configuration files
3. Trace through the directory structure to understand organization
4. Identify the data models and database schema
5. Follow the request/response flow for web applications
6. Note any unique patterns or architectural decisions
7. Consider the development and deployment workflow
8. Highlight any security or performance considerations

Focus on providing insights that would help a new developer understand the system quickly and contribute effectively. Avoid listing every file or component - instead, focus on the "big picture" architecture and key patterns that define how the system works.
```

## Usage Instructions

1. **Prepare the codebase**: Ensure the AI has access to the codebase files
2. **Use the prompt**: Copy and paste the prompt above
3. **Provide context**: You can add specific questions or areas of focus at the end
4. **Review output**: The AI will provide a structured analysis following the framework

## Example Usage Scenarios

- **New team member onboarding**: Get a quick architectural overview
- **Code review preparation**: Understand the system before reviewing
- **Documentation creation**: Generate architectural documentation
- **Refactoring planning**: Understand current architecture before changes
- **Technology migration**: Analyze current system before migrating

## Customization Options

You can modify the prompt to focus on specific aspects:

```
Additional focus areas:
- "Pay special attention to the authentication system"
- "Focus on database design and data relationships"
- "Emphasize the API design and endpoints"
- "Highlight testing strategies and coverage"
- "Analyze performance and scalability concerns"
```

## Tips for Better Results

1. **Provide relevant files**: Ensure package.json, README, and main source files are accessible
2. **Specify constraints**: Mention if you want analysis within certain limits (e.g., "focus on backend only")
3. **Ask follow-up questions**: Use the initial analysis to ask more specific questions
4. **Iterate**: Use the analysis to dive deeper into specific components or patterns

This prompt is designed to work with various AI assistants and can be adapted based on the specific codebase type and analysis needs.
