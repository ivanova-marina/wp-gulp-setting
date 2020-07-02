import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from "browser-sync";

const PRODUCTION = yargs.argv.prod;

export const styles = () => {
    return src('src/scss/main.scss')
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/style'))
    .pipe(server.stream());
}

export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/images'));
}

export const copy = () => {
    return src(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'])
    .pipe(dest('dist'))
}

export const clean = () => del(['dist']);

export const scripts = () => {
    return src(['src/js/main.js','src/js/onemore.js'])
    .pipe(named())
    .pipe(webpack({
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        mode: PRODUCTION ? 'production' : 'development',
        devtool: !PRODUCTION ? 'inline-source-map' : false,
        output: {
            filename: '[name].js'
        },
        externals: {
            jquery: 'jQuery'
        }
    }))
    .pipe(dest('dist/js'))
}

const server = browserSync.create();
export const serve = done => {
    server.init({
        proxy: "http://localhost/gulp-test/" //website link
    });
    done();
};
export const reload = done => {
    server.reload();
    done();
}

export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', images, reload);
    watch(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'], copy, reload);
    watch('src/js/**/*.js', scripts, reload);
    watch('**/*.php', reload);
}

export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges)
export const build = series(clean, parallel(styles, images, copy, scripts))
export default dev;