global.__basedir = __dirname;

process.on('warning', (e) => console.warn(e.stack));

process.on('unhandledRejection', (reason: Error) => {
    throw reason;
});

process.on('uncaughtException', (error: Error) => {
    console.error(error);

    process.exit(1);
});

export const bootstrap = (startupFn: () => Promise<void>): void => {
    startupFn();
};
