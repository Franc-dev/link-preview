'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rings } from 'react-loader-spinner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkPreview {
  title: string
  description: string
  image: string
  url: string
}

export default function Home() {
  const [name, setName] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [previews, setPreviews] = useState<LinkPreview[]>([])
  const [showNameDialog, setShowNameDialog] = useState<boolean>(true)

  useEffect(() => {
    const storedName = localStorage.getItem('name')
    if (storedName) {
      setName(storedName)
      setShowNameDialog(false)
    }

    const storedPreviews = localStorage.getItem('previews')
    if (storedPreviews) setPreviews(JSON.parse(storedPreviews))
  }, [])

  const fetchLinkPreview = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch link preview')
      }

      const data = await res.json()
      const newPreview: LinkPreview = {
        title: data.title,
        description: data.description,
        image: data.image,
        url: data.url,
      }

      const updatedPreviews = [...previews, newPreview]
      setPreviews(updatedPreviews)
      localStorage.setItem('previews', JSON.stringify(updatedPreviews))
      setUrl('')
    } catch (error) {
      console.error('Error fetching link preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index)
    setPreviews(updatedPreviews)
    localStorage.setItem('previews', JSON.stringify(updatedPreviews))
  }

  const handleEdit = (index: number, updatedPreview: LinkPreview) => {
    const updatedPreviews = [...previews]
    updatedPreviews[index] = updatedPreview
    setPreviews(updatedPreviews)
    localStorage.setItem('previews', JSON.stringify(updatedPreviews))
  }

  const handleNameSubmit = (newName: string) => {
    setName(newName)
    localStorage.setItem('name', newName)
    setShowNameDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          {name ? `Welcome, ${name}!` : 'Welcome to Link Preview'}
        </h1>

        <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>What&apos;s your name?</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() => handleNameSubmit(name)}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AnimatePresence>
          {!showNameDialog && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Add New Link Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="url"
                      placeholder="Enter URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-grow"
                    />
                    <Button onClick={fetchLinkPreview} disabled={loading}>
                      {loading ? (
                        <Rings color="#ffffff" height={24} width={24} />
                      ) : (
                        'Fetch Preview'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <motion.div layout className="space-y-4">
                {previews.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="flex items-start space-x-4 p-4">
                        <img
                          src={preview.image}
                          alt={preview.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold mb-2">{preview.title}</h2>
                          <p className="text-gray-600 mb-2">{preview.description}</p>
                          <a
                            href={preview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {preview.url}
                          </a>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Link Preview</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                  id="title"
                                  defaultValue={preview.title}
                                  onChange={(e) =>
                                    handleEdit(index, { ...preview, title: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Input
                                  id="description"
                                  defaultValue={preview.description}
                                  onChange={(e) =>
                                    handleEdit(index, { ...preview, description: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                  id="image"
                                  defaultValue={preview.image}
                                  onChange={(e) =>
                                    handleEdit(index, { ...preview, image: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="url">URL</Label>
                                <Input
                                  id="url"
                                  defaultValue={preview.url}
                                  onChange={(e) =>
                                    handleEdit(index, { ...preview, url: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={() => handleDelete(index)}>
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}