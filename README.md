# [github.com/sneat-team/sneat-apps](https://github.com/sneat-team/sneat-apps)

A suit of open source apps that help in work & personal life.

## Apps for work
- **Sneat.team** - provides authentication & org structure for below apps:
    - [DataTug](src/apps/datatug) - SQL & HTTP queries workbench
    - [ScrumSpace](src/apps/scrumspace) - daily scrums & retrospectives for agile teams 
    - [IssueNumber.One](src/apps/issuenumberone) - facilitates continuous **focused** feedback & improvements


## Apps for family & personal life 
- to be listed here

## Tech stack
- [TypeScript](https://www.typescriptlang.org/) - typed JavaScript at Any Scale
- [Angular](https://angular.io/) - the modern web developer's platform
- [Ionic Framework](https://ionicframework.com/) - an open source mobile UI toolkit for building high quality, cross-platform native and web app experiences.
- [Capacitor](https://capacitorjs.com/) - a cross-platform native runtime for web apps.
- [nx](https://nx.dev/) by [Nrwl](https://nrwl.io/) - extensible dev tools for monorepos

## How to run

Preferable way is not to use global `nx` but to use:
```shell
pnpm run nx serve <APP_NAME>
```

Shorter way:
```shell
pnpx nx serve <APP_NAME>
```

To make it even shorter first create a shortcut:
```shell
alias pnx="pnpm run nx --"
```

Then run as:
```shell
pnx serve <APP_NAME>
```

## Code generation
To generate new apps & libraries use `nx` command.

### To generate new Ionic app
Run next command:
```shell
nx generate @nxtend/ionic-angular:app my-app
```

More on how to use NX with Ionic here: https://ionicframework.com/blog/ionic-angular-monorepos-with-nx/
  