module.exports = {
    stories: ['../stories/**/*.stories.tsx'],
    addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/preset-create-react-app'],
    webpackFinal: async config => {
        // do mutation to the config
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: [['react-app', { flow: false, typescript: true }]],
            },
        });
        config.resolve.extensions.push('.ts', '.tsx');
        return config;
    },
};
