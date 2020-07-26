use neon::prelude::*;
extern crate git_analyzer;

use git_analyzer::{Repository};

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn open_repository(mut cx: FunctionContext) -> JsResult<JsObject> {
    let path = cx.argument::<JsString>(0)?.value();
    let repo = Repository::open(&path)
        .or_else(|e| {
            let message = cx.string(e);
            cx.throw(message)
        })?;
    let general_data = repo.get_general_data()
        .or_else(|e| {
            let message = cx.string(e);
            cx.throw(message)
        })?;

    let path_prop = cx.string(&general_data.path);

    let files_prop = JsArray::new(& mut cx, general_data.files.len() as u32);
    for (idx, path) in general_data.files.iter().enumerate() {
        let js_string = cx.string(path);
        files_prop.set(&mut cx, idx as u32, js_string).unwrap();
    }

    let authors_prop = JsArray::new(& mut cx, general_data.authors.len() as u32);
    for (idx, author) in general_data.authors.iter().enumerate() {
        let author_email = cx.string(&author.email);
        let author_name = cx.string(&author.name);
        let author_commits_cnt = cx.number(author.commits_count);
        let author_object = JsObject::new(&mut cx);
        author_object.set(&mut cx, "email", author_email).unwrap();
        author_object.set(&mut cx, "name", author_name).unwrap();
        author_object.set(&mut cx, "commitsCount", author_commits_cnt).unwrap();
        authors_prop.set(&mut cx, idx as u32, author_object).unwrap();
    }

    let object = JsObject::new(&mut cx);
    object.set(&mut cx, "path", path_prop).unwrap();
    object.set(&mut cx, "files", files_prop).unwrap();
    object.set(&mut cx, "authors", authors_prop).unwrap();
    Ok(object)
}

register_module!(mut cx, {
    cx.export_function("hello", hello)?;
    cx.export_function("openRepository", open_repository)?;
    Ok(())
});
