/**
 * Created by Pihemde on 28/02/15.
 */
"use strict";

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		"debian_package": {
			"options": {
				"maintainer": {
					"name": "Pierre-Marie Dhaussy",
					"email": "pierremarie.dhaussy@[google email].com"
				},
				"name": "pimp",
				"short_description": "Mini mediaplayer for Raspberry Pi",
				"long_description": "the long description added to the debian package",
				"version": "0.0.1",
				"build_number": "1",
				"category": "video",
				"postinst": {
					"src": "deb/postinst"
				},
				"links": [
				/**
				 * /usr/lib/pimp/data => /usr/share/pimp
				 */
					{
						"source": "/usr/share/{name}",
						"target": "/usr/lib/{name}/data"
					},
				/**
				 * /usr/share/pimp/configuration.json => /etc/pimp.json
				 */
					{
						"source": "/etc/{name}.json",
						"target": "/usr/share/{name}/configuration.json"
					}
				],
				"directories": [
					"/usr/lib/${name}",
					"/usr/lib/${name}/lib",
					"/usr/lib/${name}/www",
					"/usr/share/${name}"
				],
				"dependencies": "node (>=0.12)"
			},
			"files": {
				"files": [
					/**
					 * etc
					 */
					{
						"src": "data/configuration.js",
						"dest": "/etc/${name}.json"
					},
					/**
					 * bin
					 */
					{
						"src": "deb/{name}",
						"dest": "/usr/bin/"
					},
					/**
					 * lib
					 */
					{
						"src": "app.js",
						"dest": "/usr/lib/{name}/"
					},
					{
						"src": "lib/*.js",
						"dest": "/usr/lib/{name}/lib/"
					},
					{
						"cwd": "www",
						"src": [
							"*.html",
							"*.css",
							"*.js"
						],
						"dest": "/usr/lib/{name}/www/"
					},
					/**
					 * share
					 */
					{
						"src": "data/*",
						"dest": "/usr/share/{name}/"
					}
				]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks("grunt-debian-package");

	// Default task(s).
	grunt.registerTask("default", ["debian_package"]);
};