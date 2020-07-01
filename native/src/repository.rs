use git2;

pub struct Repository {
    path: String,
    inner_repo: git2::Repository,
}

pub struct RepoGeneralData {
    pub path: String,
    pub files: Vec<String>,
    pub contributors: Vec<String>,
}

pub enum Error {
    FailedToOpen(String),
}

impl From<Error> for neon::result::Throw {
    fn from(error: Error) -> Self {
        Self
    }
}

impl Repository {
    pub fn open(path: &String) -> Result<Repository, Error> {
        let inner_repo = git2::Repository::open(path)
            .map_err(|_| Error::FailedToOpen("repo not found".to_string()))?;

        Ok(Repository {
            path: path.clone(),
            inner_repo,
        })
    }

    pub fn get_files(&self) -> Vec<String> {
        let index = self.inner_repo.index().unwrap();
        let files = index
            .iter()
            .map(|item| {
                String::from_utf8(item.path).unwrap()
            })
            .collect::<Vec<String>>();

        return files;
    }

    pub fn get_general_data(&self) -> RepoGeneralData {
        return RepoGeneralData {
            path: self.path.clone(),
            files: self.get_files(),
            contributors: vec!(),
        };
    }
}

