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
    let general_data = repo.get_general_data();
    let object = JsObject::new(&mut cx);
    let path_prop = cx.string(&general_data.path);
    let files_prop = JsArray::new(& mut cx, general_data.files.len() as u32);
    for (idx, path) in general_data.files.iter().enumerate() {
        let js_string = cx.string(path);
        files_prop.set(&mut cx, idx as u32, js_string).unwrap();
    }
    object.set(&mut cx, "path", path_prop).unwrap();
    object.set(&mut cx, "files", files_prop).unwrap();
    Ok(object)
}

register_module!(mut cx, {
    cx.export_function("hello", hello)?;
    cx.export_function("openRepository", open_repository)?;
    Ok(())
});
