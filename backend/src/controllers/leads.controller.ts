import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = leadSchema.parse(req.body);
    const newLead = await Lead.create(validatedData);

    res.status(201).json({
      status: 'success',
      data: { lead: newLead },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, source, search, sort, page = '1', limit = '10' } = req.query;

    let query: any = {};

    // 1. Filtering
    if (status) query.status = status;
    if (source) query.source = source;

    // 2. Searching
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let queryObj = Lead.find(query);

    // 3. Sorting
    if (sort === 'oldest') {
      queryObj = queryObj.sort('createdAt');
    } else {
      queryObj = queryObj.sort('-createdAt'); // Latest by default
    }

    // 4. Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    queryObj = queryObj.skip(skip).limit(limitNum);

    // Execute query
    const leads = await queryObj;

    // Get total documents
    const totalLeads = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalLeads / limitNum);

    res.status(200).json({
      status: 'success',
      results: leads.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalLeads,
        totalPages,
      },
      data: { leads },
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
