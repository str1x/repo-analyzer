use git2;

pub enum Error {
    FailedToOpen,
    RevwalkCommits,
}

impl AsRef<str> for Error {
    fn as_ref(&self) -> &str {
        match self {
            Error::FailedToOpen => "Repo not found",
            Error::RevwalkCommits => "Failed to traverse the commit graph",
        }
    }
}

pub struct Repository {
    path: String,
    inner_repo: git2::Repository,
}

pub struct AuthorsItem {
    pub name: String,
    pub commits_count: u32,
    pub email: String,
}

pub struct RepoGeneralData {
    pub path: String,
    pub files: Vec<String>,
    pub authors: Vec<AuthorsItem>,
}

impl Repository {
    pub fn open(path: &String) -> Result<Repository, Error> {
        let inner_repo = git2::Repository::open(path)
            .map_err(|_| Error::FailedToOpen)?;

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

    pub fn get_authors(&self) -> Result<Vec<AuthorsItem>, Error> {
        let mut revwalk = self.inner_repo.revwalk()
            .map_err(|_| Error::RevwalkCommits)?;
        revwalk.push_head()
            .map_err(|_| Error::RevwalkCommits)?;

        let mut authors = revwalk
            .map(|r| {
                let oid = r?;
                self.inner_repo.find_commit(oid)
            })
            .filter_map(|c| match c {
                Ok(commit) => Some(commit),
                Err(_e) => None,
            })
            .fold(vec!(), |mut authors: Vec<AuthorsItem>, commit| {
                if let Some(email) = commit.author().email() {
                    let index = authors.iter().position(|x| x.email == email);
                    if index.is_some() {
                        let index = index.unwrap();
                        authors[index].commits_count += 1;
                    } else {
                        authors.push(AuthorsItem {
                            email: email.to_string(),
                            name: commit.author().name().unwrap().to_string(),
                            commits_count: 1,
                        });
                    }
                }
                authors
            });

        authors.sort_by(|a, b| b.commits_count.cmp(&a.commits_count));

        Ok(authors)
    }

    pub fn get_general_data(&self) -> Result<RepoGeneralData, Error> {
        let general_data = RepoGeneralData {
            path: self.path.clone(),
            files: self.get_files(),
            authors: self.get_authors()?,
        };
        
        Ok(general_data)
    }
}

