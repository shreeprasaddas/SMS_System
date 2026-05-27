import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@/components/common/index.js';
import { useGetBookByIdQuery } from '@/store/api/libraryApi.js';
import { ArrowLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline';

function BookDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetBookByIdQuery(bookId);

  if (isLoading) return <div className="p-8 text-center">Loading book details...</div>;
  if (error || !response?.data) return <div className="p-8 text-center text-red-500">Error loading book</div>;

  const book = response.data;
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-500">By {book.author}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge variant={isAvailable ? 'success' : 'danger'}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </Badge>
          <Button variant="secondary">Edit Book</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex gap-6">
              <div className="w-32 h-48 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <BookOpenIcon className="w-12 h-12 text-gray-400" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">ISBN</p>
                  <p className="font-medium text-gray-900">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Publisher</p>
                  <p className="font-medium text-gray-900">{book.publisher}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{book.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Edition</p>
                  <p className="font-medium text-gray-900">{book.edition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Copies</p>
                  <p className="font-medium text-gray-900">{book.totalCopies}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Copies</p>
                  <p className="font-medium text-green-600">{book.availableCopies}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{book.description || 'No description available.'}</p>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Circulation</h3>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full" 
                disabled={!isAvailable}
              >
                Issue Book
              </Button>
              <Button variant="outline" className="w-full">Reserve Book</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;
