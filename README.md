# A template resolver for static web pages

This template is based on [Bootstrap Modern Business](https://github.com/BlackrockDigital/startbootstrap-modern-business), but uses a simple [ES6 template engine](https://github.com/alialavia/gulp-es6-template-resolver) in order to generate the htmls based on some json data and javascript commands, stored in src/templates/resolve.

## Installation
```npm install ```

## Usage
Just run `gulp`, which automatically resolve all the html files in templates/ based on data in templates/resolve/data.json and commands defined in templates/resolve/commands.js.

You can reference the data and commands using javascript template strings. For example, if your data.json looks like this:

```
{
    "website": {
        "title": "Intelligi.ca: Tech, made in Toronto",
        "brand": {
          "name": "Intelligi.ca"
        }
    }    
}
```
You can use it in your html like this:
```
<html>
  <head>
    <title>
      ${website.title}
    </title>
  </head>
  <body>
    <h1>Welcome to ${website.brand.name}</h1>
    ...
```

You can also define new html commands (a collection of parametrized tags) in command.js. A simple commands.js file might look like this:

```
module.exports = {
    menu: (title, url) => `<li class="nav-item">
	                          <a class="nav-link" href="${url}">${title}</a></li>`
};
```

This defines a menu item. You can use it like this:
```
<ul class="navbar-nav ml-auto">
            ${menu('About', 'about.html')}
            ${menu('Contact', 'contact.html')} 
            ${menu('Home', 'index.html')}
</ul>
```
Or use the ```many``` helper function to avoid unneccasary repeatition:
```
<ul class="navbar-nav ml-auto">
            ${many(menu, ['About', 'about.html'],
                         ['Contact', 'contact.html'] 
                         ['Home', 'index.html']
                         )}
</ul>
```

For a comprehensive example, take a look at [src/templates/index.html](src/templates/index.html), [src/templates/resolve/data.json](src/templates/resolve/data.json) and [src/templates/resolve/commands.js](src/templates/resolve/commands.js).

## Test
```npm test```

## Important
If you have inline javascript in your html files, make sure that you don't use template strings with same names as the ones in the data.json and command.js files.
