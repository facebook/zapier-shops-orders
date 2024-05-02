# Meta Shops Orders Zapier integration

This integration should be published in the Zapier library online
So you don't need to play with the source code.

If you wish you improve the source code, these are the steps.

After cloning:

```bash
# Install dependencies
npm install

# Run tests
zapier test

# Register the integration on Zapier if you haven't already created one
zapier register "App Title"

# Or you can link to an existing integration on Zapier
zapier link

# Push it to Zapier. Include all dependencies because Facebook SDK has many that Zapier CLI can't detect
zapier push --disable-dependency-detection
```

At this point this source code would be connected to a private integration that only you have access to. You can now proceed to make changes.

# Make changes locally

Find out more on the latest docs: https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md.

```bash
# Watch and compile as you edit code
npm run watch

# There's also a non-watch compile command
npm run build

# To push to Zapier, make sure you compile first
npm run build && zapier push
```

# License

This code is made available under an [MIT license](./LICENSE). However, you may have other legal obligations that govern your use of other content, such as the terms of service for third-party solutions and technologies.
